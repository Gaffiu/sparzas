import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleToggle = () => {
    vibrate();
    playClick();
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    vibrate();
    playClick();
    setOpen(false);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={handleToggle}
        style={{
          background: '#202020', border: 'none', color: '#fff',
          width: 36, height: 36, borderRadius: '50%', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 600,
        }}
      >
        {user.email?.[0].toUpperCase() || 'U'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 44, right: 0, width: 240,
          background: '#1a1a1a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)', zIndex: 300,
          overflow: 'hidden', animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ fontWeight: 600, margin: 0, color: '#fff' }}>{user.email}</p>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: '4px 0 0' }}>Ver canal</p>
          </div>
          <Link
            to={`/channel/${user.id}`}
            onClick={() => { setOpen(false); playClick(); }}
            style={menuItemStyle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4.4-8 8-8s8 4 8 8"/></svg>
            Meu canal
          </Link>
          <Link
            to="/studio"
            onClick={() => { setOpen(false); playClick(); }}
            style={menuItemStyle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Estúdio de Criação
          </Link>
          <Link
            to="/watch-later"
            onClick={() => { setOpen(false); playClick(); }}
            style={menuItemStyle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Assistir mais tarde
          </Link>
          <Link
            to="/history"
            onClick={() => { setOpen(false); playClick(); }}
            style={menuItemStyle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Histórico
          </Link>
          <Link
            to="/liked"
            onClick={() => { setOpen(false); playClick(); }}
            style={menuItemStyle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.72l1.38-9a2 2 0 00-2-2.28H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
            Vídeos curtidos
          </Link>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={handleLogout}
              style={{ ...menuItemStyle, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '12px 16px', color: '#fff', textDecoration: 'none',
  fontSize: '0.9rem', transition: 'background 0.2s',
};
