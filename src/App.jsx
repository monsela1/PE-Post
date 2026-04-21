import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);

  // 🔴 App ID ថ្មីរបស់បង
  const FACEBOOK_APP_ID = '1520516662947333';

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : FACEBOOK_APP_ID,
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
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
        
        // 1. ទាញយកព័ត៌មាន Profile
        window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
          setUserData(userInfo);
          setIsLoggedIn(true);
        });

        // 2. ទាញយក Page ទាំងអស់ដែលបងមានសិទ្ធិ (Admin/Editor/etc.)
        window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture'}, (pageResponse) => {
          if (pageResponse && pageResponse.data) {
            setPages(pageResponse.data);
          }
        });

      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { 
      // 🔴 នេះជា Scopes ដែលបងចង់បានមកវិញ
      scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' 
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#1877F2' }}>PE Post Web App 🚀</h1>
      
      {!isLoggedIn ? (
        <div style={{ marginTop: '50px', padding: '30px', border: '1px solid #ddd', borderRadius: '15px' }}>
          <p style={{ color: '#555', marginBottom: '20px' }}>
            ចុចប៊ូតុងខាងក្រោមដើម្បីភ្ជាប់ជាមួយ Page របស់អ្នក
          </p>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: '#1877F2',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Login with Facebook
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          {/* Profile Section */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
            <img 
              src={userData?.picture?.data?.url} 
              alt="Profile" 
              style={{ borderRadius: '50%', width: '50px', height: '50px', marginRight: '15px' }} 
            />
            <div>
              <h3 style={{ margin: 0 }}>{userData?.name}</h3>
              <span style={{ color: 'green', fontSize: '12px' }}>✓ ភ្ជាប់គណនីជោគជ័យ</span>
            </div>
          </div>
          
          <h3 style={{ marginTop: '25px', marginBottom: '15px' }}>ជ្រើសរើស Page ដើម្បីផុស (សរុប: {pages.length})</h3>
          
          {/* Pages List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {pages.length > 0 ? (
              pages.map((page) => (
                <div key={page.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px', 
                  border: '1px solid #eee', 
                  borderRadius: '10px', 
                  marginBottom: '10px',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={page.picture?.data?.url} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} alt="" />
                    <strong>{page.name}</strong>
                  </div>
                  <button style={{ 
                    padding: '6px 12px', 
                    backgroundColor: '#e7f3ff', 
                    color: '#1877f2', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    ជ្រើសរើស
                  </button>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                <p>រកមិនឃើញ Page ទេ!</p>
                <small>សូមប្រាកដថាបងបាន "Select All Pages" ពេល Login</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
