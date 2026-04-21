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

  // --- UI Components ---
  const Header = ({ title, showBack = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 10px', background: '#1c1e21', color: '#fff' }}>
      {showBack ? (
        <div onClick={() => setCurrentPage('menu')} style={{ cursor: 'pointer', fontSize: '14px' }}>❮ Back</div>
      ) : <div style={{ width: '40px' }}></div>}
      <div style={{ fontWeight: 'bold' }}>{title}</div>
      <div style={{ width: '40px' }}>
         {isLoggedIn && <img src={userData?.picture?.data?.url} style={{ width: '30px', borderRadius: '50%' }} alt=""/>}
      </div>
    </div>
  );

  // --- Screens ---
  const MenuScreen = () => (
    <div style={{ padding: '15px' }}>
      <Header title="Master Post" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
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
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handlePostNow = () => {
      if (!selectedPage) return alert("សូមជ្រើសរើសផេកសិន!");
      if (!caption) return alert("សូមសរសេរអ្វីមួយ!");

      setLoading(true);
      setMsg('⌛ កំពុងផុស...');

      window.FB.api(`/${selectedPage.id}/feed`, 'POST', {
        message: caption,
        access_token: selectedPage.access_token
      }, (response) => {
        setLoading(false);
        if (response && !response.error) {
          setMsg('✅ ផុសជោគជ័យ!');
          setCaption('');
        } else {
          setMsg('❌ ផុសបរាជ័យ: ' + (response.error.message || 'Error'));
        }
      });
    };

    return (
      <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <Header title="Power Editor" showBack />
        
        <div style={{ padding: '15px' }}>
          {/* Section: Select Page */}
          <div style={sectionStyle}>
            <div style={{color: '#888', marginBottom: '10px'}}>+ Add Account / Select Page</div>
            <select 
              onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))}
              style={inputStyle}
            >
              <option value="">-- Choose Pages --</option>
              {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Section: Content */}
          <div style={sectionStyle}>
            <textarea 
              placeholder="Write caption here..." 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ ...inputStyle, height: '120px', border: 'none', outline: 'none' }}
            />
          </div>

          <button 
            disabled={loading}
            onClick={handlePostNow}
            style={btnStyle}
          >
            {loading ? 'Processing...' : 'POST NOW'}
          </button>
          
          <p style={{textAlign: 'center', marginTop: '10px', fontWeight: 'bold'}}>{msg}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
          <h1 style={{color: '#1877F2'}}>PE Post🚀</h1>
          <button onClick={handleLogin} style={btnStyle}>Login with Facebook</button>
        </div>
      ) : (
        <>
          {currentPage === 'menu' && <MenuScreen />}
          {currentPage === 'powerEditor' && <PowerEditorScreen />}
          {currentPage === 'postVideos' && <div style={{padding: '20px'}}><Header title="Post Videos" showBack />Coming Soon...</div>}
          {currentPage === 'getVideos' && <div style={{padding: '20px'}}><Header title="Get Videos" showBack />Coming Soon...</div>}
        </>
      )}
    </div>
  );
}

// --- Styles ---
const cardStyle = {
  background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)', cursor: 'pointer', fontWeight: 'bold', color: '#444'
};
const sectionStyle = {
  background: '#fff', padding: '15px', borderRadius: '10px', marginBottom: '15px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};
const inputStyle = {
  width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box'
};
const btnStyle = {
  width: '100%', padding: '15px', background: '#2c3e50', color: '#fff', border: 'none',
  borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
};

export default App;
