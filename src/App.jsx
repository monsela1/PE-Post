import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // App ID របស់បងដែលបានបញ្ចូលរួចរាល់
  const FACEBOOK_APP_ID = '1261202029015440';

  useEffect(() => {
    // ដំណើរការ Facebook SDK
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
    setIsLoading(true);
    // ហៅផ្ទាំង Login របស់ Facebook
    window.FB.login((response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        
        // ១. ទាញយកព័ត៌មានគណនីផ្ទាល់ខ្លួន
        window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
          setUserData(userInfo);
          setIsLoggedIn(true);
          
          // ២. ទាញយកបញ្ជីឈ្មោះ Page ដែលគណនីនេះគ្រប់គ្រង
          fetchPages(accessToken);
        });
      } else {
        setIsLoading(false);
        console.log('ការភ្ជាប់មិនជោគជ័យ');
      }
    }, { 
      // សុំសិទ្ធិសម្រាប់ទាញ Page និង Post
      scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' 
    });
  };

  const fetchPages = (accessToken) => {
    window.FB.api('/me/accounts', { access_token: accessToken }, (response) => {
      setIsLoading(false);
      if (response && response.data) {
        setPages(response.data); // រក្សាទុកបញ្ជី Page ទៅក្នុង State
      }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>PE Post App 🚀</h1>
      
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            សូមភ្ជាប់គណនី Facebook របស់អ្នកដើម្បីទាញយក Pages សម្រាប់ការផុស។
          </p>
          <button 
            onClick={handleLogin} 
            disabled={isLoading}
            style={{ 
              backgroundColor: isLoading ? '#999' : '#1877F2', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '16px', 
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              width: '100%',
              maxWidth: '300px'
            }}
          >
            {isLoading ? 'កំពុងភ្ជាប់...' : 'Login with Facebook'}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '20px' }}>
          {/* ផ្នែកបង្ហាញព័ត៌មាន Profile */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#f0f2f5', borderRadius: '10px', marginBottom: '20px' }}>
            <img 
              src={userData?.picture?.data?.url} 
              alt="Profile" 
              style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '15px' }} 
            />
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{userData?.name}</h3>
              <span style={{ color: 'green', fontSize: '14px', fontWeight: 'bold' }}>✓ ភ្ជាប់ជោគជ័យ</span>
            </div>
          </div>

          {/* ផ្នែកបង្ហាញបញ្ជី Page */}
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>បញ្ជី Pages របស់អ្នក ({pages.length})</h3>
          
          {isLoading ? (
            <p>កំពុងទាញយកទិន្នន័យ Pages...</p>
          ) : pages.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {pages.map((page) => (
                <li key={page.id} style={{ 
                  padding: '15px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong>{page.name}</strong>
                  <button style={{
                    backgroundColor: '#e4e6eb',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    ជ្រើសរើស
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'red' }}>រកមិនឃើញ Page ណាមួយឡើយ នៅក្នុងគណនីនេះ។</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
