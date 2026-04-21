import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);

  // 🔴 App ID: 1520516662947333
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
        
        // 1. ទាញយកព័ត៌មាន Profile ម្ចាស់គណនី
        window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
          setUserData(userInfo);
          setIsLoggedIn(true);
        });

        // 2. ទាញយក Page ទាំងអស់ (ដាក់ Limit 100 ដើម្បីឱ្យចេញមកអស់)
        window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (pageResponse) => {
          if (pageResponse && pageResponse.data) {
            setPages(pageResponse.data);
          }
        });

      } else {
        alert('ការភ្ជាប់មិនជោគជ័យ! សូមព្យាយាមម្តងទៀត។');
      }
    }, { 
      scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts',
      auth_type: 'rerequest' // បង្ខំឱ្យវាលោតផ្ទាំងសុំសិទ្ធិឡើងវិញ បើបងធ្លាប់ Login ខុស
    });
  };

  return (
    <div style={{ padding: '15px', fontFamily: '-apple-system, sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#1877F2', fontSize: '28px' }}>PE Post 🚀</h1>
        <p style={{ color: '#666' }}>គ្រប់គ្រងការផុសបានយ៉ាងរហ័ស</p>
      </header>
      
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>📱</div>
          <h3>សូមភ្ជាប់ជាមួយ Facebook</h3>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '25px' }}>ដើម្បីមើលបញ្ជីឈ្មោះ Page និងចាប់ផ្តើមការផុស</p>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: '#1877F2',
              color: 'white',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            Login with Facebook
          </button>
        </div>
      ) : (
        <div>
          {/* User Profile Card */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', padding: '15px', borderRadius: '15px', marginBottom: '25px' }}>
            <img 
              src={userData?.picture?.data?.url} 
              alt="Profile" 
              style={{ borderRadius: '50%', width: '50px', height: '50px', border: '2px solid #fff' }} 
            />
            <div style={{ marginLeft: '15px' }}>
              <h4 style={{ margin: 0 }}>{userData?.name}</h4>
              <span style={{ color: '#28a745', fontSize: '12px' }}>● កំពុងអនឡាញ</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Page របស់អ្នក ({pages.length})</h3>
          </div>

          {/* Pages Grid/List */}
          <div style={{ display: 'grid', gap: '10px' }}>
            {pages.length > 0 ? (
              pages.map((page) => (
                <div key={page.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px', 
                  background: '#fff',
                  border: '1px solid #eee', 
                  borderRadius: '12px',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={page.picture?.data?.url} style={{ width: '40px', height: '40px', borderRadius: '10px', marginRight: '12px' }} alt="" />
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{page.name}</span>
                  </div>
                  <button style={{ 
                    padding: '8px 15px', 
                    backgroundColor: '#1877F2', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: '8px', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ជ្រើសរើស
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                <p>រកមិនឃើញ Page ទេ!</p>
                <button onClick={() => window.location.reload()} style={{ color: '#1877F2', background: 'none', border: 'none', textDecoration: 'underline' }}>ចុចដើម្បីសាកល្បងម្ដងទៀត</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
