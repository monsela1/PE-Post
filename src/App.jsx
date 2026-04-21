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

  // --- Screens ---
  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
         <h1 style={{ color: '#1877F2', margin: 0, fontSize: '24px' }}>Master Post</h1>
         {isLoggedIn && <img src={userData?.picture?.data?.url} style={{ width: '35px', borderRadius: '50%' }} alt=""/>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => setCurrentPage('powerEditor')} style={cardStyle}><span style={{fontSize: '40px'}}>📘</span><br/>Power Editor</div>
        <div onClick={() => setCurrentPage('postVideos')} style={cardStyle}><span style={{fontSize: '40px'}}>🎬</span><br/>Post Videos</div>
        <div onClick={() => setCurrentPage('getVideos')} style={cardStyle}><span style={{fontSize: '40px'}}>📥</span><br/>Get Videos</div>
        <div style={cardStyle}><span style={{fontSize: '40px'}}>🖼️</span><br/>Carousel</div>
      </div>
    </div>
  );

  const PowerEditorScreen = () => {
    const [selectedPage, setSelectedPage] = useState(null);
    const [caption, setCaption] = useState('');
    const [status, setStatus] = useState('');

    return (
      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
          <div onClick={() => setCurrentPage('menu')} style={{ cursor: 'pointer', marginRight: '20px' }}>❮ Back</div>
          <div style={{ fontWeight: 'bold' }}>Video Information</div>
        </div>

        <div style={{ padding: '15px' }}>
          {/* Section: Select Page */}
          <div style={sectionStyle}>
             <select 
              onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))}
              style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }}
            >
              <option value="">🚩 អាារម្មណ៍ (Select Page)</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <textarea 
            placeholder="Write caption here" 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ width: '100%', height: '80px', border: 'none', background: 'transparent', padding: '10px 0', outline: 'none' }}
          />

          {/* 🔴 Preview Card ដូចក្នុងរូបថតបង */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '30px' }}>📹</span>
              </div>
              <div style={{ padding: '10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>ចុច Like Page ដើម្បីបានវីដេអូថ្មីៗ</span>
                <span style={{ color: '#1877F2' }}>👍</span>
              </div>
            </div>

            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#d1e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '30px' }}>🌐</span>
              </div>
              <div style={{ padding: '10px', fontSize: '12px', background: '#eee' }}>
                {selectedPage ? selectedPage.name : "Page Name"}
              </div>
            </div>
          </div>

          <button style={postBtnStyle} onClick={() => alert('កំពុងដំណើរការផុស...')}>POST</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <button onClick={handleLogin} style={postBtnStyle}>Login with Facebook</button>
        </div>
      ) : (
        <>
          {currentPage === 'menu' && <MenuScreen />}
          {currentPage === 'powerEditor' && <PowerEditorScreen />}
        </>
      )}
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold'
};
const sectionStyle = {
  background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px',
  border: '1px solid #ddd'
};
const previewCardStyle = {
  minWidth: '180px', background: '#fff', borderRadius: '8px', overflow: 'hidden',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: '1px solid #ddd'
};
const postBtnStyle = {
  width: '100%', padding: '15px', background: '#1c1e21', color: '#fff', border: 'none',
  borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px'
};

export default App;
