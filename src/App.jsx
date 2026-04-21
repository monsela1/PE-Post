import React, { useState, useEffect } from 'react';

// 🔴 App ID: 1520516662947333
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // Power Editor Workflow States
  const [powerStep, setPowerStep] = useState(1);
  const [videoLink, setVideoLink] = useState('');
  const [videoPreview, setVideoPreview] = useState(null); // ទុកសម្រាប់បង្ហាញរូប Preview
  const [selectedPage, setSelectedPage] = useState(null);
  const [caption, setCaption] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.fbAsyncInit = function() {
      window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: true, version: 'v19.0' });
      window.FB.getLoginStatus((response) => {
        if (response.status === 'connected') fetchUserInfo();
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
    window.FB.api('/me', {fields: 'name,picture'}, (u) => { setUserData(u); setIsLoggedIn(true); });
    window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (p) => { setPages(p.data || []); });
  };

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) fetchUserInfo();
    }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' });
  };

  // មុខងារពេលរើស File ពីក្នុងម៉ាស៊ីន (Phone/PC)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url); // បង្ហាញវីដេអូ Preview
      setVideoLink(''); // លុប Link ចេញបើមាន
    }
  };

  // មុខងារពេលចុច UPLOAD VIDEO ដើម្បីទៅផ្ទាំងបន្ទាប់
  const goToPostStep = () => {
    if (!videoLink && !videoPreview) {
      return alert("សូមដាក់ Link វីដេអូ ឬរើស File វីដេអូជាមុនសិន!");
    }
    setPowerStep(2);
  };

  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', fontSize: '22px' }}>Master Post</h1>
        <div style={{ display: 'flex', gap: '10px' }}><span>☕</span><span>🌐</span></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => setCurrentPage('powerEditor')} style={cardStyle}>📘<br/>Power Editor</div>
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
        <div style={{ padding: '15px' }}>
          <div style={masterBoxStyle} onClick={handleLogin}>
            {isLoggedIn ? `Account: ${userData.name}` : '+ Add Account'}
          </div>
          <div style={masterBoxStyle}>
            <input type="file" id="pPicker" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <label htmlFor="pPicker" style={selectBtnStyle}>Select Video File</label>
            
            <div style={{ margin: '15px 0', color: '#888', fontWeight: 'bold' }}>OR</div>
            
            <input 
              type="text" 
              placeholder="PLEASE INPUT VIDEO URL" 
              style={urlInputStyle} 
              value={videoLink} 
              onChange={(e) => { setVideoLink(e.target.value); setVideoPreview(null); }} 
            />
          </div>
          <button style={uploadBtnStyle} onClick={goToPostStep}>UPLOAD VIDEO</button>
        </div>
      ) : (
        <div style={{ padding: '15px' }}>
          <div style={sectionStyle}>
            <select onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent' }}>
              <option value="">🚩 {selectedPage ? selectedPage.name : "ជ្រើសរើស Page"}</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <textarea placeholder="Write caption here" style={{ width: '100%', height: '80px', border: 'none', outline: 'none' }} value={caption} onChange={(e) => setCaption(e.target.value)} />
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
            {/* Card 1: បង្ហាញវីដេអូពិតៗដែលបងបានដាក់ */}
            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {videoPreview ? (
                  <video src={videoPreview} style={{width: '100%', height: '100%'}} controls />
                ) : (
                  <div style={{color: '#fff', textAlign: 'center', padding: '10px'}}>
                    {videoLink ? "Link បានដាក់រួចរាល់" : "មិនមានវីដេអូ"}
                  </div>
                )}
              </div>
              <div style={{ padding: '10px', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                <span>ចុច Like Page ដើម្បីបានវីដេអូថ្មីៗ</span> 👍
              </div>
            </div>

            {/* Card 2: បង្ហាញឈ្មោះផេក */}
            <div style={previewCardStyle}>
              <div style={{ height: '200px', background: '#d1e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedPage ? <img src={selectedPage.picture?.data?.url} style={{width: '60px', borderRadius: '50%'}} /> : "PREVIEW"}
              </div>
              <div style={{ padding: '10px', fontSize: '12px', background: '#eee' }}>{selectedPage ? selectedPage.name : "Page Name"}</div>
            </div>
          </div>
          <button style={uploadBtnStyle} onClick={() => alert('កំពុងផុស...')}>POST</button>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const cardStyle = { background: '#fff', padding: '25px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold' };
const masterBoxStyle = { background: '#fff', padding: '30px 20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ddd', textAlign: 'center' };
const selectBtnStyle = { display: 'inline-block', padding: '10px 25px', border: '2px solid #333', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold' };
const urlInputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const uploadBtnStyle = { width: '100%', padding: '15px', background: '#232a34', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold' };
const sectionStyle = { background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '1px solid #ddd' };
const previewCardStyle = { minWidth: '200px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' };

export default App;
