import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSound } from './hooks/useSound';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import Channel from './pages/Channel';
import NotFound from './pages/NotFound';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, logout } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      playClick();
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#050505' }}>
      {/* Navbar vidro fixa */}
      <nav style={{
        height:64, background:'rgba(12,12,12,0.9)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', padding:'0 24px',
        position:'sticky', top:0, zIndex:200, gap:16
      }}>
        {isMobile && (
          <button onClick={() => { setSidebarOpen(!sidebarOpen); playClick(); }} style={{ background:'none', border:'none', color:'#fff', fontSize:22, padding:8 }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1h20M1 9h20M1 17h20"/></svg>
          </button>
        )}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <Logo />
          <span style={{ fontSize:'1.6rem', fontWeight:800, color:'#00e676', letterSpacing:-0.5 }}>SPARZAS</span>
        </Link>
        <form onSubmit={handleSearch} style={{ flex:1, display:'flex', justifyContent:'center' }}>
          <input type="text" placeholder="Pesquisar videos..." value={search} onChange={e => setSearch(e.target.value)} style={{
            width:'100%', maxWidth:480, padding:'10px 18px', background:'#121212', border:'1px solid #2a2a2a',
            borderRadius:'24px 0 0 24px', color:'#fff', fontSize:'0.95rem', outline:'none',
          }} />
          <button type="submit" style={{
            background:'#1a1a1a', border:'1px solid #2a2a2a', borderLeft:'none', borderRadius:'0 24px 24px 0',
            padding:'0 20px', color:'#fff', cursor:'pointer',
          }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M14 14l5 5"/></svg>
          </button>
        </form>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {user ? (
            <>
              <Link to="/upload" onClick={playClick} style={{ color:'#fff', textDecoration:'none', fontWeight:500, fontSize:'0.95rem' }}>Publicar</Link>
              <button onClick={() => { logout(); playClick(); }} style={{
                background:'transparent', border:'1px solid #333', color:'#fff', padding:'6px 16px', borderRadius:20,
                fontSize:'0.85rem', cursor:'pointer', transition:'0.2s',
              }}>Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={playClick} style={{
              background:'#00e676', color:'#000', padding:'8px 22px', borderRadius:24, fontWeight:600,
              textDecoration:'none', fontSize:'0.95rem',
            }}>Entrar</Link>
          )}
        </div>
      </nav>

      <div style={{ display:'flex', flex:1 }}>
        <Sidebar open={sidebarOpen} close={closeSidebar} fixed={!isMobile} />
        <main style={{ flex:1, padding:'28px 24px', overflowY:'auto' }} onClick={() => isMobile && closeSidebar()}>
          <div style={{ opacity:1 }} key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/channel/:id" element={<Channel />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Estilos globais (animações e reset) */}
      <style>{`
        @keyframes neonPulse {
          0%,100% { filter: drop-shadow(0 0 6px #00e676); }
          50% { filter: drop-shadow(0 0 18px #00e676) drop-shadow(0 0 36px #1de9b6); }
        }
        @keyframes fadeInUp {
          from { opacity:0; transform: translateY(24px); }
          to { opacity:1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes particleBurst {
          0% { transform: translate(0,0) scale(1); opacity:1; }
          100% {
            transform: translate(
              calc(cos(var(--angle)) * var(--dist)),
              calc(sin(var(--angle)) * var(--dist))
            ) scale(0);
            opacity:0;
          }
        }
        body {
          margin:0;
          font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background:#050505;
          color:#fff;
          -webkit-font-smoothing:antialiased;
          overscroll-behavior: none;
        }
        a { text-decoration:none; color:inherit; }
        input, textarea, button { font-family:inherit; }
        html, body, #root { height: 100%; overflow-x: hidden; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
