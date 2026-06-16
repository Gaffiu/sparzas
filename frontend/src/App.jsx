import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSound } from './hooks/useSound';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';

// Lazy loading das páginas
const Home = lazy(() => import('./pages/Home'));
const Watch = lazy(() => import('./pages/Watch'));
const Upload = lazy(() => import('./pages/Upload'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Channel = lazy(() => import('./pages/Channel'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const History = lazy(() => import('./pages/History'));
const Liked = lazy(() => import('./pages/Liked'));

// Placeholder de carregamento
function PageLoader() {
  return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
      <div style={{ width:36, height:36, border:'4px solid #333', borderTop:'4px solid #00e676', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Wrapper para transições animadas
function AnimatedPage({ children }) {
  return (
    <div className="page page-active">
      {children}
    </div>
  );
}

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

  // Vibração ao clicar
  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      vibrate(); playClick();
      navigate(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#050505' }}>
      {/* Navbar */}
      <nav style={{
        height:64, background:'rgba(12,12,12,0.9)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', padding:'0 24px',
        position:'sticky', top:0, zIndex:200, gap:16
      }}>
        {isMobile && (
          <button onClick={() => { setSidebarOpen(!sidebarOpen); vibrate(); playClick(); }} style={{ background:'none', border:'none', color:'#fff', fontSize:22, padding:8 }}>
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1h20M1 9h20M1 17h20"/></svg>
          </button>
        )}
        <Link to="/" onClick={vibrate} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <Logo />
          <span style={{ fontSize:'1.6rem', fontWeight:800, color:'#00e676', letterSpacing:-0.5 }}>SPARZAS</span>
        </Link>
        {!isMobile && (
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
        )}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {user ? (
            <>
              {!isMobile && <Link to="/upload" onClick={() => { vibrate(); playClick(); }} style={{ color:'#fff', textDecoration:'none', fontWeight:500, fontSize:'0.95rem' }}>Publicar</Link>}
              <button onClick={() => { logout(); vibrate(); playClick(); }} style={{
                background:'transparent', border:'1px solid #333', color:'#fff', padding:'6px 16px', borderRadius:20,
                fontSize:'0.85rem', cursor:'pointer', transition:'0.2s',
              }}>Sair</button>
            </>
          ) : (
            <Link to="/login" onClick={() => { vibrate(); playClick(); }} style={{
              background:'#00e676', color:'#000', padding:'8px 22px', borderRadius:24, fontWeight:600,
              textDecoration:'none', fontSize:'0.95rem',
            }}>Entrar</Link>
          )}
        </div>
      </nav>

      <div style={{ display:'flex', flex:1 }}>
        {!isMobile && <Sidebar open={sidebarOpen} close={closeSidebar} fixed={!isMobile} />}
        {isMobile && sidebarOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:140 }} onClick={closeSidebar} />
        )}
        {isMobile && (
          <div style={{
            position:'fixed', top:64, left:0, width:260, height:'calc(100vh - 64px)',
            background:'#0c0c0c', zIndex:150, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-280px)',
            transition:'transform 0.3s ease', borderRight:'1px solid rgba(255,255,255,0.04)',
          }}>
            {/* Sidebar mobile simplificada */}
            <Sidebar open={true} close={closeSidebar} fixed={false} />
          </div>
        )}
        <main style={{ flex:1, padding:'28px 24px', overflowY:'auto', paddingBottom: isMobile ? 80 : 28 }}
          onClick={() => sidebarOpen && closeSidebar()}>
          <Suspense fallback={<PageLoader />}>
            <AnimatedPage key={location.pathname}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/channel/:id" element={<Channel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatedPage>
          </Suspense>
        </main>
      </div>
      {isMobile && <MobileTabBar />}
      {/* Estilos globais */}
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
        .page {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 64px);
        }
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
