import React, { useState, useEffect } from 'react';

// 🔴 App ID របស់បង
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // Power Editor Workflow States
  const [powerStep, setPowerStep] = useState(1); // 1: Input Video, 2: Post Info
  const [videoSource, setVideoSource] = useState(''); // Link ពី YT, TT, FB
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [selectedPage, setSelectedPage] = useState(null);

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

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      alert("បានរើសវីដេអូ៖ " + file.name);
    }
  };

  // --- Screens ---

  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '22px', fontWeight: 'bold' }}>Master Post</h1>
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
      <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
        <div onClick={() => powerStep === 1 ? setCurrentPage('menu') : setPowerStep(1)} style={{ cursor: 'pointer', marginRight: '20px' }}>❮ Back</div>
        <div style={{ fontWeight: 'bold' }}>{powerStep === 1 ? 'Power Editor' : 'Video Information'}</div>
      </div>

      {powerStep === 1 ? (
        /* 🔵 STEP 1: SELECT VIDEO FROM PHONE/PC OR LINK (image_9.png) */
        <div style={{ padding: '15px' }}>
          <div style={masterBoxStyle} onClick={handleLogin}>
            {isLoggedIn ? `Connected: ${userData.name}` : '+ Add Account'}
          </div>

          <div style={masterBoxStyle}>
            <input type="file" id="filePicker" accept="video/*" style={{ display: 'none' }} onChange={onFileChange} />
            <label htmlFor="filePicker" style={selectBtnStyle}>
              {selectedFile ? 'Change Video File' : 'Select Video File'}
            </label>
            {selectedFile && <p style={{fontSize: '12px', color: 'green', marginTop: '5px'}}>{selectedFile.name}</p>}

            <div style={{ margin: '15px 0', color: '#888', fontWeight: 'bold' }}>OR</div>

            <input 
              type="text" 
              placeholder="PLEASE INPUT VIDEO URL (YouTube, TikTok, Facebook)" 
              style={urlInputStyle} 
              value={videoSource} 
              onChange={(e) => setVideoSource(e.target.value)}
            />
          </div>

          <button style={uploadBtnStyle} onClick={() => setPowerStep(2)}>
            UPLOAD VIDEO
          </button>
          
          <div style={{textAlign: 'center', marginTop: '15px'}}>
            <a href="#" style={{fontSize: '13px', color: '#1877F2'}}>How to use it?</a>
          </div>
        </div>
      ) : (
        /* 🔵 STEP 2: VIDEO INFORMATION (image_8.png) */
        <div style={{ padding: '15px' }}>
          <div style={sectionStyle}>
            <select onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}>
              <option value="">🚩 ជ្រើសរើស Page</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <textarea 
            placeholder="Write caption here..." 
            style={{ width: '100%', height: '80px', border: 'none', outline: 'none', background: 'transparent' }} 
            value={caption} onChange={(e) => setCaption(e.target.value)}
          />

          {/* PE Preview Cards */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
            <div style={previewCardStyle}>
              <div style={{ height: '180px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedFile ? 'VIDEO READY' : (videoSource ? 'LINK READY' : 'NO VIDEO')}
              </div>
              <div style={{ padding: '10px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                <span>ចុច Like Page...</span> 👍
              </div>
            </div>
            <div style={previewCardStyle}>
              <div style={{ height: '180px', background: '#d1e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PREVIEW</div>
              <div style={{ padding: '10px', fontSize: '11px', background: '#eee' }}>{selectedPage ? selectedPage.name : "Page Name"}</div>
            </div>
          </div>

          <button style={uploadBtnStyle} onClick={() => alert('កំពុងផុសទៅ Facebook...')}>POST</button>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const cardStyle = { background: '#fff', padding: '25px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold' };
const masterBoxStyle = { background: '#fff', padding: '30px 20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd', textAlign: 'center', cursor: 'pointer' };
const selectBtnStyle = { display: 'inline-block', padding: '10px 25px', border: '2px solid #333', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' };
const urlInputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' };
const uploadBtnStyle = { width: '100%', padding: '18px', background: '#232a34', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' };
const sectionStyle = { background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd' };
const previewCardStyle = { minWidth: '160px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' };

export default App;
