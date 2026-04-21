import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // 🔴 បញ្ចូល App ID ដែលអ្នកបានបង្កើតក្នុង Meta for Developers
  const FACEBOOK_APP_ID = 'ដាក់_APP_ID_របស់អ្នកទីនេះ';

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
      }
    }, { 
      scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' 
    });
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Master Post Web App 🚀</h1>
      
      {!isLoggedIn ? (
        <div style={{ marginTop: '50px' }}>
          <button onClick={handleLogin} style={{ backgroundColor: '#1877F2', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
            Login with Facebook
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
          <img src={userData?.picture?.data?.url} alt="Profile" style={{ borderRadius: '50%', width: '80px', height: '80px' }} />
          <h2>សួស្តី, {userData?.name}! 👋</h2>
          <p style={{ color: 'green' }}>✓ ភ្ជាប់គណនីជោគជ័យ</p>
        </div>
      )}
    </div>
  );
}

export default App;
