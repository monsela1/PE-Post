import React, { useState, useEffect } from 'react';

// 🔴 App ID របស់បង
const FACEBOOK_APP_ID = '1520516662947333';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu');
  
  // Carousel PE Logic
  const [selectedPage, setSelectedPage] = useState(null);
  const [caption, setCaption] = useState('');
  const [img1, setImg1] = useState(''); // Link រូបភាពទី១ (វីដេអូ)
  const [img2, setImg2] = useState(''); // Link រូបភាពទី២ (ប៊ូតុង Like)
  const [targetLink, setTargetLink] = useState(''); // Link ពេលគេចុចទៅ
  const [status, setStatus] = useState('');

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

  const handleCarouselPost = () => {
    if (!selectedPage || !img1 || !img2) return alert("សូមបំពេញព័ត៌មានឱ្យគ្រប់គ្រាន់!");
    
    setStatus('⌛ កំពុងបញ្ជូនទៅ Facebook...');

    // រៀបចំកាត Carousel (ម្ខាងវីដេអូ ម្ខាងប៊ូតុង Like)
    const child_attachments = [
      {
        link: targetLink || 'https://facebook.com',
        name: selectedPage.name,
        picture: img1, // រូបភាពកាតទី១
      },
      {
        link: `https://facebook.com/${selectedPage.id}`, // ចុចទៅលោតចូលផេកឱ្យគេ Like
        name: 'ចុច Like Page ដើម្បីមើលវីដេអូថ្មីៗ',
        picture: img2, // រូបភាពកាតទី២
      }
    ];

    window.FB.api(
      `/${selectedPage.id}/feed`,
      'POST',
      {
        message: caption,
        link: targetLink || 'https://facebook.com',
        child_attachments: JSON.stringify(child_attachments),
        access_token: selectedPage.access_token
      },
      (response) => {
        if (response && !response.error) {
          setStatus('✅ ផុសបែប Carousel ជោគជ័យ!');
        } else {
          setStatus('❌ Error: ' + response.error.message);
        }
      }
    );
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'sans-serif', background: '#f0f2f5', minHeight: '100vh' }}>
      {currentPage === 'menu' ? (
        /* MENU SCREEN */
        <div style={{ padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h1 style={{ color: '#1877F2', margin: 0 }}>Master Post</h1>
            {isLoggedIn && <img src={userData?.picture?.data?.url} style={{ width: '35px', borderRadius: '50%' }} alt=""/>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div onClick={() => setCurrentPage('powerEditor')} style={cardStyle}>📘<br/>Power Editor</div>
            <div style={cardStyle}>🎬<br/>Post Videos</div>
            <div style={cardStyle}>📥<br/>Get Videos</div>
            <div style={cardStyle}>⚙️<br/>Settings</div>
          </div>
          {!isLoggedIn && <button onClick={handleLogin} style={btnStyle}>Add Account</button>}
        </div>
      ) : (
        /* POWER EDITOR SCREEN */
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
          <div style={{ background: '#2c3e50', color: '#fff', padding: '15px', display: 'flex', alignItems: 'center' }}>
            <div onClick={() => setCurrentPage('menu')} style={{ cursor: 'pointer', marginRight: '20px' }}>❮ Back</div>
            <div style={{ fontWeight: 'bold' }}>Carousel PE Post</div>
          </div>

          <div style={{ padding: '15px' }}>
            <div style={sectionStyle}>
              <select onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))} style={inputStyle}>
                <option value="">🚩 ជ្រើសរើស Page</option>
                {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <textarea placeholder="Write caption here..." style={inputStyle} value={caption} onChange={(e) => setCaption(e.target.value)} />
            
            <div style={sectionStyle}>
               <label style={labelStyle}>Image 1 URL (Video Thumbnail):</label>
               <input type="text" placeholder="https://..." style={inputStyle} value={img1} onChange={(e) => setImg1(e.target.value)} />
               
               <label style={labelStyle}>Image 2 URL (Like Button):</label>
               <input type="text" placeholder="https://..." style={inputStyle} value={img2} onChange={(e) => setImg2(e.target.value)} />
               
               <label style={labelStyle}>Target Link URL:</label>
               <input type="text" placeholder="https://..." style={inputStyle} value={targetLink} onChange={(e) => setTargetLink(e.target.value)} />
            </div>

            {/* PREVIEW CAROUSEL */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '20px' }}>
              <div style={previewBox}>
                <div style={{height: '150px', background: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   {img1 ? <img src={img1} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : 'Image 1'}
                </div>
                <div style={{padding: '5px', fontSize: '10px'}}>{selectedPage?.name || 'Page Name'}</div>
              </div>
              <div style={previewBox}>
                <div style={{height: '150px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                   {img2 ? <img src={img2} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : 'Image 2'}
                </div>
                <div style={{padding: '5px', fontSize: '10px'}}>ចុច Like Page... 👍</div>
              </div>
            </div>

            <button style={btnStyle} onClick={handleCarouselPost}>POST NOW (CAROUSEL)</button>
            <p style={{textAlign: 'center', marginTop: '10px', fontWeight: 'bold'}}>{status}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ---
const cardStyle = { background: '#fff', padding: '25px 10px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold' };
const sectionStyle = { background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px', outline: 'none', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '15px', background: '#1c1e21', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };
const labelStyle = { fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' };
const previewBox = { minWidth: '140px', background: '#fff', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' };

export default App;
