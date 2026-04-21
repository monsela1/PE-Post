import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [status, setStatus] = useState('');

  const FACEBOOK_APP_ID = '1520516662947333';

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
    };
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, []);

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
          setUserData(userInfo);
          setIsLoggedIn(true);
        });
        window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (pageResponse) => {
          if (pageResponse && pageResponse.data) {
            setPages(pageResponse.data);
          }
        });
      }
    }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' });
  };

  // 🔴 មុខងារបញ្ជាទៅ Facebook ឱ្យផុស
  const handlePost = () => {
    if (!selectedPage) return alert("សូមជ្រើសរើស Page សិន!");
    if (!postContent) return alert("សូមសរសេរអ្វីមួយមុននឹងផុស!");

    setStatus('កំពុងផុស...');

    window.FB.api(
      `/${selectedPage.id}/feed`,
      'POST',
      {
        message: postContent,
        access_token: selectedPage.access_token
      },
      (response) => {
        if (response && !response.error) {
          setStatus('✅ ផុសជោគជ័យនៅលើ Page: ' + selectedPage.name);
          setPostContent('');
        } else {
          console.error(response.error);
          setStatus('❌ ផុសអត់បានទេ: ' + response.error.message);
        }
      }
    );
  };

  return (
    <div style={{ padding: '15px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ color: '#1877F2', textAlign: 'center' }}>PE Post 🚀</h1>
      
      {!isLoggedIn ? (
        <button onClick={handleLogin} style={{ width: '100%', padding: '15px', backgroundColor: '#1877F2', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
          Login with Facebook
        </button>
      ) : (
        <div>
          {/* ផ្ទាំងសរសេរអត្ថបទ */}
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '15px' }}>
            <h4>សរសេរអ្វីដែលអ្នកចង់ផុស៖</h4>
            <textarea 
              style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }}
              placeholder="តើអ្នកកំពុងគិតអ្វី?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            
            {selectedPage && (
              <p style={{ color: '#1877F2', fontWeight: 'bold', marginTop: '10px' }}>📍 កំពុងរៀបចំផុសទៅកាន់៖ {selectedPage.name}</p>
            )}

            <button 
              onClick={handlePost}
              style={{ width: '100%', marginTop: '10px', padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ចុចដើម្បីផុស (Post Now)
            </button>
            <p style={{ textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>{status}</p>
          </div>

          <h3>ជ្រើសរើស Page គោលដៅ៖</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {pages.map((page) => (
              <div 
                key={page.id} 
                onClick={() => setSelectedPage(page)}
                style={{ 
                  display: 'flex', alignItems: 'center', padding: '10px', background: selectedPage?.id === page.id ? '#e7f3ff' : '#fff',
                  border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer'
                }}
              >
                <img src={page.picture?.data?.url} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} alt="" />
                <span style={{ fontWeight: selectedPage?.id === page.id ? 'bold' : 'normal' }}>{page.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
