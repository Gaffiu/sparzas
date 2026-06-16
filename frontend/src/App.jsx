import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useSound } from './hooks/useSound';
import Logo from './components/Logo';
import Sidebar from './components/Sidebar';
import MobileTabBar from './components/MobileTabBar';
import { IconSearch, IconMenu, IconUpload } from './components/Icons';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const Watch = lazy(() => import('./pages/Watch'));
const Upload = lazy(() => import('./pages/Upload'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Channel = lazy(() => import('./pages/Channel'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const History = lazy(() => import('./pages/History'));
const Liked = lazy(() => import('./pages/Liked'));
const Studio = lazy(() => import('./pages/Studio'));
const WatchLater = lazy(() => import('./pages/WatchLater'));
const Explore = lazy(() => import('./pages/Explore'));
const Playlists = lazy(() => import('./pages/Playlists'));
const Settings = lazy(() => import('./pages/Settings'));
const Permissions = lazy(() => import('./pages/Permissions'));
const NotFound = lazy(() => import('./pages/NotFound'));

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}><h2>Algo deu errado.</h2><button onClick={() => this.setState({ hasError: false })} className="btn btn-primary">Tentar novamente</button></div>;
    return this.props.children;
  }
}

function PageLoader() {
  return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><div className="spinner" /></div>;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Swipe da borda esquerda
  useEffect(() => {
    if (!isMobile) return;
    let touchStartX = 0;
    const handleTouchStart = (e) => { touchStartX = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (touchStartX < 30 && diff > 60) setSidebarOpen(true);
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { vibrate(); playClick(); navigate(`/?search=${encodeURIComponent(search.trim())}`); }
  };
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      <nav className="navbar">
        {isMobile && <button className="nav-icon-btn" onClick={() => { setSidebarOpen(!sidebarOpen); vibrate(); playClick(); }}><IconMenu /></button>}
        <Link to="/" className="logo-link" onClick={vibrate}><Logo size={28} /><span className="logo-text">SPARZAS</span></Link>
        {!isMobile && (
          <form className="search-form" onSubmit={handleSearch}>
            <input type="text" placeholder="Pesquisar vídeos..." value={search} onChange={e => setSearch(e.target.value)} className="search-input" />
            <button type="submit" className="search-btn"><IconSearch /></button>
          </form>
        )}
        <div className="nav-actions">
          {user ? (
            <Link to="/upload" className="upload-link" onClick={() => { vibrate(); playClick(); }}><IconUpload size={18} /> Publicar</Link>
          ) : (
            <Link to="/login" className="login-btn" onClick={() => { vibrate(); playClick(); }}>Entrar</Link>
          )}
        </div>
      </nav>

      <div className="main-wrapper">
        {!isMobile && <Sidebar open={sidebarOpen} close={closeSidebar} fixed={!isMobile} />}
        {isMobile && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
        {isMobile && <div className={`sidebar-mobile ${sidebarOpen ? 'open' : ''}`}><Sidebar open={true} close={closeSidebar} fixed={false} /></div>}
        <main className="main-content" style={{ paddingBottom: isMobile ? 80 : 28 }} onClick={() => sidebarOpen && closeSidebar()}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/permissions" element={<Permissions />} />
                <Route path="/channel/:id" element={<Channel />} />
                <Route path="/subscriptions" element={<Subscriptions />} />
                <Route path="/history" element={<History />} />
                <Route path="/liked" element={<Liked />} />
                <Route path="/studio" element={<Studio />} />
                <Route path="/watch-later" element={<WatchLater />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      {isMobile && <MobileTabBar />}
    </div>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><Layout /></AuthProvider></BrowserRouter>;
}
