import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconExplore, IconShorts, IconSubscriptions, IconChannel, IconLibrary, IconHistory, IconLiked, IconTrending, IconMusic, IconGame, IconSports } from './Icons';

export default function Sidebar({ open, close, fixed }) {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('sparzas_history') || '[]').slice(0, 3));
  }, []);

  const handleClick = () => { close(); playClick(); };

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', padding: '10px 16px', margin: '2px 8px',
    borderRadius: 10, textDecoration: 'none', color: isActive ? '#00e676' : '#ccc',
    background: isActive ? 'rgba(0,230,118,0.08)' : 'transparent',
    transition: '0.15s', fontSize: '0.9rem', fontWeight: isActive ? 500 : 400, gap: 14,
  });

  const asideStyle = {
    width: 250, background: 'rgba(10,15,10,0.95)', padding: '16px 0',
    height: fixed ? 'calc(100vh - 56px)' : 'calc(100vh - 56px)',
    position: fixed ? 'sticky' : 'fixed', top: fixed ? 0 : 56, left: 0, zIndex: 150,
    overflowY: 'auto', borderRight: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)',
    transform: fixed ? 'none' : (open ? 'translateX(0)' : 'translateX(-260px)'),
    transition: fixed ? 'none' : 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
  };

  return (
    <>
      {!fixed && open && <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:140 }} />}
      <aside style={asideStyle}>
        <NavLink to="/" end onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconHome color={isActive?'#00e676':'#ccc'} /> Início</span>}</NavLink>
        <NavLink to="/explore" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconExplore color={isActive?'#00e676':'#ccc'} /> Explorar</span>}</NavLink>
        <NavLink to="/shorts" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconShorts color={isActive?'#00e676':'#ccc'} /> Shorts</span>}</NavLink>
        <NavLink to="/subscriptions" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconSubscriptions color={isActive?'#00e676':'#ccc'} /> Inscrições</span>}</NavLink>
        {user && <NavLink to={`/channel/${user.id}`} onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconChannel color={isActive?'#00e676':'#ccc'} /> Meu canal</span>}</NavLink>}
        <div style={{ borderTop:'1px solid var(--border-subtle)', margin:'10px 12px' }} />
        <NavLink to="/trending" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconTrending color={isActive?'#00e676':'#ccc'} /> Em alta</span>}</NavLink>
        <NavLink to="/category/music" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconMusic color={isActive?'#00e676':'#ccc'} /> Música</span>}</NavLink>
        <NavLink to="/category/gaming" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconGame color={isActive?'#00e676':'#ccc'} /> Jogos</span>}</NavLink>
        <NavLink to="/category/sports" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconSports color={isActive?'#00e676':'#ccc'} /> Esportes</span>}</NavLink>
        <div style={{ borderTop:'1px solid var(--border-subtle)', margin:'10px 12px' }} />
        <NavLink to="/library" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconLibrary color={isActive?'#00e676':'#ccc'} /> Biblioteca</span>}</NavLink>
        <NavLink to="/history" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconHistory color={isActive?'#00e676':'#ccc'} /> Histórico</span>}</NavLink>
        <NavLink to="/liked" onClick={handleClick}>{({isActive}) => <span style={linkStyle(isActive)}><IconLiked color={isActive?'#00e676':'#ccc'} /> Curtidos</span>}</NavLink>
        {history.length > 0 && (
          <>
            <div style={{ borderTop:'1px solid var(--border-subtle)', margin:'10px 12px' }} />
            <p style={{ padding:'0 16px', fontSize:'0.75rem', color:'var(--text-muted)', margin:'6px 0' }}>Histórico recente</p>
            {history.map(v => (
              <NavLink key={v.id} to={`/watch/${v.id}`} onClick={handleClick} style={({isActive}) => ({...linkStyle(isActive), gap:10, padding:'8px 16px'})}>
                <img src={v.thumbnail_url || 'https://via.placeholder.com/24x14'} alt="" style={{ width:24, height:18, borderRadius:4, objectFit:'cover', flexShrink:0 }} />
                <span style={{ fontSize:'0.85rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.title}</span>
              </NavLink>
            ))}
          </>
        )}
      </aside>
    </>
  );
}
