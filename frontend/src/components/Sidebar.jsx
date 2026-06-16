import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import {
  IconHome, IconExplore, IconShorts, IconSubscriptions, IconChannel,
  IconLibrary, IconHistory, IconLiked, IconTrending, IconMusic, IconGame, IconSports
} from './Icons';

export default function Sidebar({ open, close, fixed }) {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [history, setHistory] = useState([]);

  const handleClick = () => { close(); playClick(); };

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', padding: '8px 16px', margin: '0 8px',
    borderRadius: 8, textDecoration: 'none', color: isActive ? '#00e676' : '#ddd',
    background: isActive ? 'rgba(0,230,118,0.1)' : 'transparent',
    transition: '0.15s', fontSize: '0.9rem', fontWeight: isActive ? 500 : 400,
    gap: 14, lineHeight: 1.2,
  });

  const asideStyle = {
    width: 240, background: '#0a0a0a', padding: '12px 0',
    height: fixed ? 'calc(100vh - 56px)' : 'calc(100vh - 56px)',
    position: fixed ? 'sticky' : 'fixed', top: fixed ? 0 : 56, left: 0, zIndex: 150,
    overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.04)',
    transform: fixed ? 'none' : (open ? 'translateX(0)' : 'translateX(-260px)'),
    transition: fixed ? 'none' : 'transform 0.2s ease',
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    setHistory(stored.slice(0, 3));
  }, []);

  return (
    <>
      {!fixed && open && <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:140 }} />}
      <aside style={asideStyle}>
        <NavLink to="/" end onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHome color={isActive ? '#00e676' : '#ccc'} /> Início</>}
        </NavLink>
        <NavLink to="/explore" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconExplore color={isActive ? '#00e676' : '#ccc'} /> Explorar</>}
        </NavLink>
        <NavLink to="/shorts" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconShorts color={isActive ? '#00e676' : '#ccc'} /> Shorts</>}
        </NavLink>
        <NavLink to="/subscriptions" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconSubscriptions color={isActive ? '#00e676' : '#ccc'} /> Inscrições</>}
        </NavLink>
        {user && (
          <NavLink to={`/channel/${user.id}`} onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
            {({isActive}) => <><IconChannel color={isActive ? '#00e676' : '#ccc'} /> Meu canal</>}
          </NavLink>
        )}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'8px 12px' }} />
        <NavLink to="/trending" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconTrending color={isActive ? '#00e676' : '#ccc'} /> Em alta</>}
        </NavLink>
        <NavLink to="/category/music" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconMusic color={isActive ? '#00e676' : '#ccc'} /> Música</>}
        </NavLink>
        <NavLink to="/category/gaming" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconGame color={isActive ? '#00e676' : '#ccc'} /> Jogos</>}
        </NavLink>
        <NavLink to="/category/sports" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconSports color={isActive ? '#00e676' : '#ccc'} /> Esportes</>}
        </NavLink>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'8px 12px' }} />
        <NavLink to="/library" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconLibrary color={isActive ? '#00e676' : '#ccc'} /> Biblioteca</>}
        </NavLink>
        <NavLink to="/history" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHistory color={isActive ? '#00e676' : '#ccc'} /> Histórico</>}
        </NavLink>
        <NavLink to="/liked" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconLiked color={isActive ? '#00e676' : '#ccc'} /> Curtidos</>}
        </NavLink>

        {/* Histórico recente */}
        {history.length > 0 && (
          <>
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'8px 12px' }} />
            <p style={{ padding: '0 16px', fontSize: '0.8rem', color: '#888', margin: '4px 0' }}>Histórico recente</p>
            {history.map((v) => (
              <NavLink key={v.id} to={`/watch/${v.id}`} onClick={handleClick} style={({isActive}) => ({
                ...linkStyle(isActive),
                gap: 10,
                padding: '6px 16px',
              })}>
                <img
                  src={v.thumbnail_url || 'https://via.placeholder.com/24x14'}
                  alt=""
                  style={{ width: 24, height: 18, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {v.title}
                </span>
              </NavLink>
            ))}
          </>
        )}
      </aside>
    </>
  );
}
