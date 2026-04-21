import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' ឬ 'post'

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

  const handlePost = () => {
    if (!selectedPage) return alert("សូមជ្រើសរើស Page សិន!");
    if (!postContent) return alert("សូមសរសេរ Caption សិន!");

    setStatus('⌛ កំពុងដំណើរការ...');
    window.FB.api(`/${selectedPage.id}/feed`, 'POST', {
      message: postContent,
      access_token: selectedPage.access_token
    }, (response) => {
      if (response && !response.error) {
        setStatus('✅ ផុសជោគជ័យ!');
        setPostContent('');
      } else {
        setStatus('❌ បរាជ័យ: ' + (response.error.message || "Unknown Error"));
      }
    });
  };

  const CardButton = ({ title, icon, color, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        flex: 1,
        background: '#fff',
        borderRadius: '20px',
        padding: '25px 10px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        border: '1px solid #f0f0f0',
        margin: '5px'
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '10px', color: color }}>{icon}</div>
      <div style={{ fontWeight: '600', color: '#444' }}>{title}</div>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: '-apple-system, sans-serif', maxWidth: '500px', margin: '0 auto', minHeight: '100vh', background: '#f8f9fa' }}>
      <h2 style={{ textAlign: 'center', color: '#1877F2', marginBottom: '30px' }}>PE Post Studio</h2>

      {!isLoggedIn ? (
        <button onClick={handleLogin} style={{ width: '100%', padding: '15px', background: '#1877F2', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>
          Connect Facebook
        </button>
      ) : (
        <div>
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', background: '#fff', padding: '12px', borderRadius: '15px' }}>
            <img src={userData?.picture?.data?.url} style={{ width: '45px', height: '45px', borderRadius: '50%' }} alt="" />
            <div style={{ marginLeft: '12px' }}>
              <div style={{ fontWeight: 'bold' }}>{userData?.name}</div>
              <div style={{ fontSize: '12px', color: 'green' }}>Active Account</div>
            </div>
          </div>

          {activeTab === 'menu' ? (
            /* 🔴 ផ្នែក Card Menu ដូចក្នុងរូបថតបង */
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <CardButton 
                title="Power Editor" 
                icon="📘" 
                color="#1877F2" 
                onClick={() => setActiveTab('post')} 
              />
              <CardButton 
                title="Post Videos" 
                icon="🎬" 
                color="#ff4757" 
                onClick={() => alert('មុខងារផុសវីដេអូ កំពុងរៀបចំ...')} 
              />
            </div>
          ) : (
            /* 🔴 ផ្នែក Form ផុស */
            <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <button onClick={() => setActiveTab('menu')} style={{ background: 'none', border: 'none', color: '#1877F2', marginBottom: '15px', cursor: 'pointer' }}>← ត្រឡប់ក្រោយ</button>
              
              <h4 style={{ margin: '0 0 10px 0' }}>ជ្រើសរើសផេក៖</h4>
              <select 
                onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #ddd' }}
              >
                <option value="">-- រើស Page --</option>
                {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>

              <textarea 
                placeholder="សរសេរ Caption នៅទីនេះ..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '12px', border: '1px solid #eee', boxSizing: 'border-box' }}
              />
              
              <button onClick={handlePost} style={{ width: '100%', marginTop: '15px', padding: '12px', background: '#1877F2', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
                Post Now
              </button>
              <p style={{ textAlign: 'center', marginTop: '10px', color: status.includes('✅') ? 'green' : 'red' }}>{status}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
