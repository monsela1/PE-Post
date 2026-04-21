import React, { useState, useEffect } from 'react';

// --- PE Post: Master Post Inspired UI ---
// 🔴 App ID: 1520516662947333

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState('menu'); // Determines which screen to show

  const FACEBOOK_APP_ID = '1520516662947333';

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

  // --- Common UI Components ---

  const Header = ({ title, showBack = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
      {showBack ? (
        <button onClick={() => setCurrentPage('menu')} style={{ background: 'none', border: 'none', color: '#1877F2', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          &lt; Back
        </button>
      ) : (
        <h1 style={{ color: '#1877F2', margin: 0, fontSize: '24px' }}>PE Post 🚀</h1>
      )}
      <h2 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{title}</h2>
      {isLoggedIn && userData && (
        <img src={userData.picture?.data?.url} alt="Profile" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
      )}
    </div>
  );

  const MasterCard = ({ title, icon, color, onClick, description }) => (
    <div 
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '25px 10px',
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        border: '1px solid #f5f5f5',
        transition: 'transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '150px' // Make cards uniform
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ fontSize: '50px', marginBottom: '10px', color: color }}>{icon}</div>
      <div style={{ fontWeight: '700', color: '#2C3E50', fontSize: '16px' }}>{title}</div>
      {description && <div style={{ fontSize: '12px', color: '#7F8C8D', marginTop: '5px' }}>{description}</div>}
    </div>
  );

  const ActionButton = ({ children, onClick, color = '#1877F2' }) => (
    <button 
      onClick={onClick}
      style={{
        width: '100%',
        padding: '15px',
        backgroundColor: color,
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
      {children}
    </button>
  );

  const MasterInput = (props) => (
    <input 
      {...props}
      style={{
        width: '100%',
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        boxSizing: 'border-box',
        fontSize: '14px',
        marginBottom: '15px',
        ...props.style
      }}
    />
  );

  // --- Individual Screen Components ---

  const MenuScreen = () => (
    <div>
      <Header title="Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '20px' }}>
        <MasterCard title="Power Editor" icon="📘" color="#1877F2" onClick={() => setCurrentPage('powerEditor')} description="Manage Accounts & Posts" />
        <MasterCard title="Post Videos" icon="🎬" color="#ff4757" onClick={() => setCurrentPage('postVideos')} description="Share Reels & Videos" />
        <MasterCard title="Get Videos" icon="📥" color="#f1c40f" onClick={() => setCurrentPage('getVideos')} description="Download via URL" />
        <MasterCard title="Carousel Post" icon="🖼️" color="#2ecc71" onClick={() => alert('មុខងារ Carousel កំពុងរៀបចំ...')} description="Multiple Photos Post" />
        <MasterCard title="Split Video" icon="✂️" color="#9b59b6" onClick={() => alert('មុខងារ Split កំពុងរៀបចំ...')} description="Cut long videos" />
        <MasterCard title="Settings" icon="⚙️" color="#7f8c8d" onClick={() => alert('Settings Section')} description="App Config" />
      </div>
    </div>
  );

  const PowerEditorScreen = () => {
    const [selectedPage, setSelectedPage] = useState(null);
    const [status, setStatus] = useState('');

    const testPost = () => {
      if (!selectedPage) return alert("សូមជ្រើសរើស Page សិន!");
      setStatus('⌛ Testing...');
      // Simple text post for testing
      window.FB.api(`/${selectedPage.id}/feed`, 'POST', {
        message: 'Hello from PE Post Power Editor!',
        access_token: selectedPage.access_token
      }, (response) => {
        if (response && !response.error) {
          setStatus('✅ ផុសជោគជ័យ!');
        } else {
          setStatus('❌ បរាជ័យ: ' + (response.error.message || "Unknown Error"));
        }
      });
    };

    return (
      <div>
        <Header title="Power Editor" showBack />
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>ជ្រើសរើស Page ដើម្បីគ្រប់គ្រង៖</h4>
          <select 
            onChange={(e) => setSelectedPage(pages.find(p => p.id === e.target.value))}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}
          >
            <option value="">-- Choose Page --</option>
            {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {selectedPage && (
            <div style={{ display: 'flex', alignItems: 'center', background: '#e7f3ff', padding: '10px', borderRadius: '10px', marginBottom: '15px' }}>
              <img src={selectedPage.picture?.data?.url} style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }} alt="" />
              <strong>{selectedPage.name}</strong>
            </div>
          )}

          <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888', background: '#f9f9f9', borderRadius: '10px' }}>
            [ placeholder: ផ្ទាំងគ្រប់គ្រង Account ស្រដៀង image_4.png ]
          </div>

          <ActionButton onClick={testPost}>Test Post</ActionButton>
          <p style={{ textAlign: 'center', marginTop: '10px', color: status.includes('✅') ? 'green' : 'red' }}>{status}</p>
        </div>
      </div>
    );
  };

  const PostVideosScreen = () => (
    <div>
      <Header title="Post Videos" showBack />
      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>ជ្រើសរើស Page គោលដៅ៖</h4>
        <select style={{ width: '100%', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}>
          <option value="">-- Choose Page --</option>
          {pages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <textarea placeholder="Write caption here..." style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '10px', border: '1px solid #eee', boxSizing: 'border-box', marginBottom: '20px' }} />
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button style={{ flex: 1, padding: '15px', background: '#f0f2f5', border: '2px dashed #ccc', borderRadius: '12px', color: '#555', cursor: 'pointer' }}>Select Video File</button>
          <div style={{ alignSelf: 'center' }}>OR</div>
          <button style={{ flex: 1, padding: '15px', background: '#fff', border: '1px solid #eee', borderRadius: '12px', color: '#555', cursor: 'pointer' }}>Import URL</button>
        </div>

        <div style={{ background: '#f9f9f9', padding: '20px', textAlign: 'center', borderRadius: '10px', color: '#888' }}>
          [ placeholder: Schedule & Post (image_5.png) ]
        </div>

        <ActionButton onClick={() => alert('មុខងារផុសវីដេអូ កំពុងរៀបចំ...')} color="#ff4757">UPLOAD & POST</ActionButton>
      </div>
    </div>
  );

  const GetVideosScreen = () => (
    <div>
      <Header title="Get Videos" showBack />
      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
        <div style={{ fontSize: '100px', marginBottom: '20px', color: '#f1c40f' }}>📥</div>
        <h3 style={{ margin: '0 0 15px 0' }}>ទាញយកវីដេអូ</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>សូម Paste URL នៃវីដេអូដែលអ្នកចង់ទាញយកនៅខាងក្រោម</p>
        
        <MasterInput type="text" placeholder="Please input video URL (Facebook/Reels/etc.)" />
        
        <ActionButton onClick={() => alert('កំពុង Search...')} color="#34495e">SEARCH & DOWNLOAD</ActionButton>
      </div>
    </div>
  );

  // --- Main App Logic ---

  return (
    <div style={{ 
      padding: '10px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      maxWidth: '480px', 
      margin: '0 auto', 
      minHeight: '100vh', 
      background: '#f0f2f5', // App background color
      color: '#333'
    }}>
      {!isLoggedIn ? (
        <div style={{ textAlign: 'center', paddingTop: '100px', paddingLeft: '20px', paddingRight: '20px' }}>
          <h1 style={{ color: '#1877F2', fontSize: '36px', marginBottom: '10px' }}>PE Post🚀</h1>
          <p style={{ color: '#666', marginBottom: '50px' }}>Your Facebook Page Companion</p>
          
          <div style={{ background: '#fff', padding: '40px 20px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '70px', marginBottom: '20px' }}>🔑</div>
            <h2 style={{ margin: '0 0 15px 0' }}>Welcome to PE Post</h2>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '30px' }}>Please connect your Facebook account to manage your pages, post videos, and get started.</p>
            <ActionButton onClick={handleLogin}>Login with Facebook</ActionButton>
          </div>
          
          <p style={{ color: '#aaa', fontSize: '12px', marginTop: '50px' }}>pe-post.vercel.app © 2024</p>
        </div>
      ) : (
        <div style={{ paddingBottom: '30px' }}>
          {currentPage === 'menu' && <MenuScreen />}
          {currentPage === 'powerEditor' && <PowerEditorScreen />}
          {currentPage === 'postVideos' && <PostVideosScreen />}
          {currentPage === 'getVideos' && <GetVideosScreen />}
        </div>
      )}
    </div>
  );
}

export default App;
