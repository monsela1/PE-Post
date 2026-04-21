import React, { useState, useEffect } from 'react';

// 🔴 App ID: 1520516662947333
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
      
      // ពិនិត្យមើលថាគេធ្លាប់ Login ឬនៅពេលបើក App មកភ្លាម
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
          fetchUserInfo();
        }
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

  const fetchUserInfo = () => {
    window.FB.api('/me', {fields: 'name,picture'}, (userInfo) => {
      setUserData(userInfo);
      setIsLoggedIn(true);
    });
    window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (pageResponse) => {
      if (pageResponse && pageResponse.data) {
        setPages(pageResponse.data);
      }
    });
  };

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        fetchUserInfo();
      }
    }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' });
  };

  // មុខងារត្រួតពិនិត្យមុននឹងចូលប្រើមុខងារនីមួយៗ
  const navigateTo = (pageName) => {
    if (!isLoggedIn) {
      alert("សូម Add Account ជាមុនសិន!");
      handleLogin();
    } else {
      setCurrentPage(pageName);
    }
  };

  // --- Screens ---
  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h1 style={{ color: '#1877F2', margin: 0, fontSize: '24px' }}>Master Post</h1>
         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>☕</span>
            <span style={{ fontSize: '20px' }}>🌐</span>
         </div>
      </div>

      {/* Banner Ad placeholder */}
      <div style={{ background: '#4CAF50', padding: '15px', borderRadius: '5px', color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
         <strong>Soundy AI: Noise Remover</strong><br/>
         <small>លុបសំឡេងរំខានចេញភ្លាមៗ!</small>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => navigateTo('powerEditor')} style={cardStyle}><span style={{fontSize: '40px'}}>📘</span><br/>Power Editor</div>
        <div onClick={() => navigateTo('postVideos')} style={cardStyle}><span style={{fontSize: '40px'}}>🎬</span><br/>Post Videos</div>
        <div onClick={() => navigateTo('soundyAI')} style={cardStyle}><span style={{fontSize: '40px'}}>📊</span><br/>Soundy AI</div>
        <div onClick={() => navigateTo('getVideos')} style={cardStyle}><span style={{fontSize: '40px'}}>📥</span><br/>Get Videos</div>
        <div onClick={() => navigateTo('carousel')} style={cardStyle}><span style={{fontSize: '40px'}}>🖼️</span><br/>Photo Carousel</div>
        <div onClick={() => navigateTo('split')} style={cardStyle}><span style={{fontSize: '40px'}}>✂️</span><br/>Split Video</div>
      </div>
    </div>
  );

  const PowerEditorScreen = () => (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <div onClick={() => setCurrentPage('menu')} style={{ cursor: 'pointer', marginRight: '20px' }}>❮ Back</div>
        <div style={{ fontWeight: 'bold' }}>Power Editor</div>
      </div>
      <div style={{ padding: '15px' }}>
        <div style={sectionStyle} onClick={handleLogin}>
          <center>+ Add Account</center>
        </div>
        <div style={sectionStyle}>
           <select style={{ width: '100%', border: 'none', background: 'transparent' }}>
              <option>🚩 Choose Pages</option>
              {pages.map(p => <option key={p.id}>{p.name}</option>)}
           </select>
        </div>
        <textarea placeholder="Write caption here..." style={{ width: '100%', height: '100px', border: 'none', padding: '10px', borderRadius: '10px', marginBottom: '10px' }} />
        <button style={postBtnStyle}>POST</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' }}>
      {currentPage === 'menu' && <MenuScreen />}
      {currentPage === 'powerEditor' && <PowerEditorScreen />}
      {/* អាចបន្ថែម Screen ផ្សេងៗទៀតនៅទីនេះ */}
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center',
  boxShadow: '0 2px 15px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #eee'
};
const sectionStyle = {
  background: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '15px',
  border: '1px solid #ddd', color: '#888', cursor: 'pointer'
};
const postBtnStyle = {
  width: '100%', padding: '15px', background: '#1c1e21', color: '#fff', border: 'none',
  borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
};

export default App;
