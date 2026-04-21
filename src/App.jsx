import React, { useState, useEffect } from 'react';

// 🔴 App ID របស់បង
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // States សម្រាប់ Power Editor
  const [videoLink, setVideoLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

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

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // --- Screens ---

  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Master <span style={{fontStyle: 'italic'}}>Post</span></h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <span>☕</span> <span>🌐</span>
        </div>
      </div>
      
      {/* Banner Ad placeholder */}
      <div style={{ background: '#4CAF50', padding: '12px', borderRadius: '8px', color: '#fff', marginBottom: '20px', textAlign: 'center', fontSize: '14px' }}>
        <strong>Soundy AI: Noise Remover</strong><br/>លុបសំឡេងរំខានចេញភ្លាមៗ!
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => navigateTo('powerEditor')} style={cardStyle}><span style={{fontSize: '35px'}}>📘</span><br/>Power Editor</div>
        <div onClick={() => navigateTo('postVideos')} style={cardStyle}><span style={{fontSize: '35px'}}>🎬</span><br/>Post Videos</div>
        <div style={cardStyle}><span style={{fontSize: '35px'}}>📊</span><br/>Soundy AI</div>
        <div style={cardStyle}><span style={{fontSize: '35px'}}>📥</span><br/>Get Videos</div>
        <div style={cardStyle}><span style={{fontSize: '35px'}}>🖼️</span><br/>Photo Carousel</div>
        <div style={cardStyle}><span style={{fontSize: '35px'}}>✂️</span><br/>Split Video</div>
      </div>
    </div>
  );

  const PowerEditorScreen = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <div onClick={() => setCurrentPage('menu')} style={{ cursor: 'pointer', marginRight: '20px', fontSize: '18px' }}>❮ Back</div>
        <div style={{ fontWeight: 'bold', flex: 1, textAlign: 'center', marginRight: '40px' }}>Power Editor</div>
      </div>

      <div style={{ padding: '15px' }}>
        {/* Add Account Section */}
        <div style={masterBoxStyle} onClick={handleLogin}>
          <div style={{ fontSize: '16px', color: '#555' }}>+ Add Account</div>
        </div>

        {/* Video Selection Section */}
        <div style={masterBoxStyle}>
          <input 
            type="file" 
            id="videoInput" 
            accept="video/*" 
            style={{ display: 'none' }} 
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <label htmlFor="videoInput" style={selectBtnStyle}>
            {selectedFile ? selectedFile.name : 'Select Video File'}
          </label>

          <div style={{ margin: '15px 0', color: '#888', fontWeight: 'bold' }}>OR</div>

          <input 
            type="text" 
            placeholder="PLEASE INPUT VIDEO URL" 
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            style={urlInputStyle}
          />
        </div>

        {/* Upload Button */}
        <button style={uploadBtnStyle} onClick={() => alert('កំពុងទាញយក និងរៀបចំបញ្ជូន...')}>
          UPLOAD VIDEO
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a href="#" style={{ color: '#1877F2', textDecoration: 'underline', fontSize: '14px' }}>How to use it?</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif', background: '#fff', minHeight: '100vh' }}>
      {currentPage === 'menu' && <MenuScreen />}
      {currentPage === 'powerEditor' && <PowerEditorScreen />}
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  background: '#fff', padding: '20px 10px', borderRadius: '15px', textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold', border: '1px solid #f0f0f0'
};
const masterBoxStyle = {
  background: '#fff', padding: '30px 20px', borderRadius: '8px', marginBottom: '15px',
  border: '1px solid #ddd', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
};
const selectBtnStyle = {
  display: 'inline-block', padding: '10px 30px', border: '2px solid #333', borderRadius: '25px',
  cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
};
const urlInputStyle = {
  width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd',
  boxSizing: 'border-box', fontSize: '14px', background: '#fff', outline: 'none'
};
const uploadBtnStyle = {
  width: '100%', padding: '18px', background: '#232a34', color: '#fff', border: 'none',
  borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer'
};

export default App;
