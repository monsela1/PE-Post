import React, { useState, useEffect } from 'react';

// --- 🔴 រំកិល Styles មកដាក់លើគេ ដើម្បីកុំឱ្យ Error សសុទ្ធ ---
const cardStyle = { 
  background: '#fff', padding: '25px 10px', borderRadius: '16px', textAlign: 'center', 
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)', cursor: 'pointer', fontWeight: 'bold', color: '#333', border: '1px solid #f4f4f4' 
};
const addAccountBoxStyle = { 
  background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', 
  border: '1px solid #e0e0e0', textAlign: 'center', cursor: 'pointer', color: '#666', fontWeight: 'bold' 
};
const selectBtnStyle = { 
  display: 'inline-block', padding: '12px 30px', border: '2px solid #224078', color: '#224078', 
  borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'all 0.2s' 
};
const urlInputStyle = { 
  width: '100%', padding: '16px', borderRadius: '10px', border: '1px solid #e0e0e0', 
  boxSizing: 'border-box', outline: 'none', background: '#fcfcfc', fontSize: '14px' 
};
const uploadBtnStyle = { 
  width: '100%', padding: '18px', background: '#224078', color: '#7EEDB2', border: 'none', 
  borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(34, 64, 120, 0.3)' 
};
const previewCardStyle = { 
  minWidth: '220px', maxWidth: '250px', background: '#fff', borderRadius: '12px', overflow: 'hidden', 
  border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', flex: '0 0 auto' 
};

// 🔴 App ID របស់បង
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // Power Editor Workflow States
  const [powerStep, setPowerStep] = useState(1);
  const [videoLink, setVideoLink] = useState('');
  const [videoPreview, setVideoPreview] = useState(null); 
  const [selectedPage, setSelectedPage] = useState(null);
  const [caption, setCaption] = useState('');

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
    window.FB.api('/me/accounts', {fields: 'name,access_token,id,picture', limit: 100}, (p) => { 
      setPages(p.data || []); 
      if(p.data && p.data.length > 0) setSelectedPage(p.data[0]); 
    });
  };

  const handleLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) fetchUserInfo();
    }, { scope: 'public_profile,pages_show_list,pages_read_engagement,pages_manage_posts' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setVideoLink('');
    }
  };

  const goToPostStep = () => {
    if (!videoLink && !videoPreview) {
      return alert("សូមដាក់ Link វីដេអូ ឬរើស File វីដេអូជាមុនសិន!");
    }
    setPowerStep(2);
  };

  // --- Screens ---

  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#224078', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Master <span style={{fontStyle: 'italic', fontWeight: 'normal'}}>Post</span></h1>
        <div style={{ display: 'flex', gap: '15px', fontSize: '20px' }}><span>☕</span><span>🌐</span></div>
      </div>
      
      <div style={{ background: '#7EEDB2', padding: '15px', borderRadius: '12px', color: '#1a3059', marginBottom: '20px', textAlign: 'center', boxShadow: '0 4px 10px rgba(126, 237, 178, 0.3)' }}>
        <strong style={{ fontSize: '16px' }}>Soundy AI: Noise Remover</strong><br/>
        <span style={{ fontSize: '13px' }}>លុបសំឡេងរំខានចេញភ្លាមៗ!</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div onClick={() => { setCurrentPage('powerEditor'); setPowerStep(1); }} style={cardStyle}>
          <span style={{fontSize: '38px'}}>📘</span><br/><span style={{marginTop: '8px', display: 'block'}}>Power Editor</span>
        </div>
        <div style={cardStyle}><span style={{fontSize: '38px'}}>🎬</span><br/><span style={{marginTop: '8px', display: 'block'}}>Post Videos</span></div>
        <div style={cardStyle}><span style={{fontSize: '38px'}}>📊</span><br/><span style={{marginTop: '8px', display: 'block'}}>Soundy AI</span></div>
        <div style={cardStyle}><span style={{fontSize: '38px'}}>📥</span><br/><span style={{marginTop: '8px', display: 'block'}}>Get Videos</span></div>
        <div style={cardStyle}><span style={{fontSize: '38px'}}>🖼️</span><br/><span style={{marginTop: '8px', display: 'block'}}>Photo Carousel</span></div>
        <div style={cardStyle}><span style={{fontSize: '38px'}}>✂️</span><br/><span style={{marginTop: '8px', display: 'block'}}>Split Video</span></div>
      </div>
    </div>
  );

  const PowerEditorScreen = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '30px' }}>
      <div style={{ background: '#224078', color: '#fff', padding: '15px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div onClick={() => powerStep === 1 ? setCurrentPage('menu') : setPowerStep(1)} style={{ cursor: 'pointer', marginRight: '20px', fontSize: '16px' }}>❮ Back</div>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{powerStep === 1 ? 'Power Editor' : 'Video Information'}</div>
      </div>

      {powerStep === 1 ? (
        <div style={{ padding: '20px' }}>
          <div style={addAccountBoxStyle} onClick={handleLogin}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <img src={userData?.picture?.data?.url} style={{ width: '30px', borderRadius: '50%' }} alt="" />
                <span style={{ color: '#224078', fontWeight: 'bold' }}>{userData?.name}</span>
              </div>
            ) : '+ Add Account'}
          </div>

          <div style={{ background: '#fff', padding: '30px 20px', borderRadius: '15px', marginBottom: '20px', border: '1px solid #eee', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <input type="file" id="vPicker" accept="video/*" style={{ display: 'none' }} onChange={handleFileChange} />
            <label htmlFor="vPicker" style={selectBtnStyle}>
              {videoPreview ? 'Change Video File' : 'Select Video File'}
            </label>
            
            <div style={{ margin: '20px 0', color: '#aaa', fontWeight: 'bold', fontSize: '14px' }}>OR</div>
            
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
        <div style={{ padding: '20px' }}>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: 'bold' }}>ជ្រើសរើស Page៖</div>
            <div style={{ display: 'flex', overflowX: 'auto', gap: '12px', paddingBottom: '10px' }}>
              {pages.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedPage(p)}
                  style={{ 
                    minWidth: '80px', padding: '12px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                    border: `2px solid ${selectedPage?.id === p.id ? '#7EEDB2' : '#eee'}`, 
                    background: selectedPage?.id === p.id ? '#224078' : '#fff', 
                    color: selectedPage?.id === p.id ? '#fff' : '#444'
                  }}
                >
                  <img src={p.picture?.data?.url} style={{ width: '40px', height: '40px', borderRadius: '50%', marginBottom: '5px' }} alt="" />
                  <div style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '70px', margin: '0 auto' }}>{p.name}</div>
                </div>
              ))}
            </div>
          </div>

          <textarea 
            placeholder="Write caption here..." 
            style={{ width: '100%', height: '90px', border: '1px solid #eee', borderRadius: '12px', padding: '15px', outline: 'none', background: '#fff', fontSize: '14px', boxSizing: 'border-box', marginBottom: '20px', resize: 'none' }} 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
          />
          
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', marginBottom: '25px', paddingBottom: '5px' }}>
            <div style={previewCardStyle}>
              <div style={{ height: '220px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {videoPreview ? (
                  <video src={videoPreview} style={{width: '100%', height: '100%', objectFit: 'cover'}} controls />
                ) : (
                  <div style={{color: '#fff', textAlign: 'center', padding: '20px'}}>
                    <span style={{fontSize: '30px', display: 'block', marginBottom: '10px'}}>🔗</span>
                    {videoLink ? "Link Ready" : "No Video"}
                  </div>
                )}
              </div>
              <div style={{ padding: '12px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', background: '#fff', fontWeight: 'bold' }}>
                <span>ចុច Like Page ដើម្បីបានវីដេអូថ្មីៗ</span> <span style={{color: '#224078', fontSize: '14px'}}>👍</span>
              </div>
            </div>

            <div style={previewCardStyle}>
              <div style={{ height: '220px', background: '#eef2f9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {selectedPage ? (
                  <>
                    <img src={selectedPage?.picture?.data?.url} style={{width: '70px', height: '70px', borderRadius: '50%', marginBottom: '10px'}} alt="" />
                    <div style={{fontWeight: 'bold', color: '#224078', fontSize: '14px'}}>{selectedPage.name}</div>
                  </>
                ) : (
                  <div style={{color: '#888'}}>PREVIEW</div>
                )}
              </div>
              <div style={{ padding: '12px', fontSize: '12px', background: '#fff', color: '#666', borderTop: '1px solid #eee' }}>
                {selectedPage ? selectedPage.name : "Page Name"}
              </div>
            </div>
          </div>

          <button style={uploadBtnStyle} onClick={() => alert('មុខងារតភ្ជាប់ API កំពុងរៀបចំ...')}>POST NOW</button>
        </div>
      )}
    </div>
  );
}

export default App;
