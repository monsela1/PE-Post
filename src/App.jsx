import React, { useState, useEffect } from 'react';

// 🔴 App ID របស់បង
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // Power Editor Logic
  const [powerStep, setPowerStep] = useState(1); // 1: Select Video, 2: Post Info
  const [videoLink, setVideoLink] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: 'v19.0' });
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
        window.FB.api('/me', {fields: 'name,picture'}, (u) => { setUserData(u); setIsLoggedIn(true); });
        window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (p) => { setPages(p.data || []); });
      }
    }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' });
  };

  // --- Screens ---

  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '22px' }}>Master Post</h1>
        <span>🌐</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => { setCurrentPage('powerEditor'); setPowerStep(1); }} style={cardStyle}>📘<br/>Power Editor</div>
        <div style={cardStyle}>🎬<br/>Post Videos</div>
        <div style={cardStyle}>📥<br/>Get Videos</div>
        <div style={cardStyle}>🖼️<br/>Carousel</div>
      </div>
    </div>
  );

  const PowerEditorScreen = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <div onClick={() => powerStep === 1 ? setCurrentPage('menu') : setPowerStep(1)} style={{ cursor: 'pointer', marginRight: '20px' }}>❮ Back</div>
        <div style={{ fontWeight: 'bold' }}>{powerStep === 1 ? 'Power Editor' : 'Video Information'}</div>
      </div>

      {powerStep === 1 ? (
        /* STEP 1: SELECT VIDEO (image_9.png) */
        <div style={{ padding: '15px' }}>
          <div style={masterBoxStyle} onClick={handleLogin}>+ Add Account</div>
          <div style={masterBoxStyle}>
            <div style={selectBtnStyle}>Select Video File</div>
            <div style={{ margin: '15px 0', color: '#888' }}>OR</div>
            <input 
              type="text" placeholder="PLEASE INPUT VIDEO URL" 
              style={urlInputStyle} value={videoLink} onChange={(e) => setVideoLink(e.target.value)}
            />
          </div>
          <button style={uploadBtnStyle} onClick={() => setPowerStep(2)}>UPLOAD VIDEO</button>
        </div>
      ) : (
        /* STEP 2: POST INFO (image_8.png) - ទំរង់ផុសបែប PE */
        <div style={{ padding: '15px' }}>
          <div style={sectionStyle}>
            <select 
              onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
            >
              <option value="">🚩 {selectedPage ? selectedPage.name : "អារម្មណ៍"}</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <textarea 
            placeholder="Write caption here" 
            style={{ width: '100%', height: '80px', border: 'none', background: 'transparent', outline: 'none', padding: '10px 0' }}
            value={caption} onChange={(e) => setCaption(e.target.value)}
          />

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>VIDEO</div>
              <div style={{ padding: '10px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                <span>ចុច Like Page ដើម្បីបានវីដេអូថ្មីៗ</span> 👍
              </div>
            </div>
            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#d1e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PREVIEW</div>
              <div style={{ padding: '10px', fontSize: '12px', background: '#eee' }}>{selectedPage ? selectedPage.name : "Page Name"}</div>
            </div>
          </div>

          <button style={uploadBtnStyle} onClick={() => alert('កំពុងផុសទៅកាន់ Facebook...')}>POST</button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {currentPage === 'menu' ? <MenuScreen /> : <PowerEditorScreen />}
    </div>
  );
}

// --- Styles ---
const cardStyle = { background: '#fff', padding: '25px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold' };
const masterBoxStyle = { background: '#fff', padding: '30px 20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd', textAlign: 'center' };
const selectBtnStyle = { display: 'inline-block', padding: '10px 25px', border: '2px solid #333', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const urlInputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const uploadBtnStyle = { width: '100%', padding: '15px', background: '#232a34', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const sectionStyle = { background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd' };
const previewCardStyle = { minWidth: '180px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' };

export default App;
