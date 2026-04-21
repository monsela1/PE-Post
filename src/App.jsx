import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // App ID របស់បង
  const FACEBOOK_APP_ID = '1261202029015440';

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
        window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
          setUserData(userInfo);
          setIsLoggedIn(true);
        });
      } else {
        console.log('ការភ្ជាប់មិនជោគជ័យ ឬអ្នកប្រើប្រាស់បិទផ្ទាំង Login។');
      }
    }, { 
      // សុំសិទ្ធិត្រឹម Profile សិនដើម្បីធ្វើតេស្តកុំឱ្យ Error
      scope: 'public_profile' 
    });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>PE Post Web App 🚀</h1>
      
      {!isLoggedIn ? (
        <div style={{ marginTop: '50px' }}>
          <p style={{ color: '#555', marginBottom: '20px' }}>
            សូមភ្ជាប់គណនី Facebook របស់អ្នក (តេស្តជំហានទី១)
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
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Login with Facebook
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <img 
            src={userData?.picture?.data?.url} 
            alt="Profile" 
            style={{ borderRadius: '50%', width: '80px', height: '80px' }} 
          />
          <h2>សួស្តី, {userData?.name}! 👋</h2>
          <p style={{ color: 'green' }}>✓ ភ្ជាប់គណនីជោគជ័យ</p>
          <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
          <p>អបអរសាទរ! តេស្ត Login ជោគជ័យហើយ។</p>
        </div>
      )}
    </div>
  );
}

export default App;
