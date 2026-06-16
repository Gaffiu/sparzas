import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconExplore, IconShorts, IconSubscriptions, IconChannel, IconLibrary, IconHistory, IconLiked } from './Icons';

export default function Sidebar({ open, close, fixed }) {
  const { user } = useAuth();
  const { playClick } = useSound();
  const handleClick = () => { close(); playClick(); };

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', padding: '10px 20px', margin: '2px 10px',
    borderRadius: 10, textDecoration: 'none', color: isActive ? '#00e676' : '#aaa',
    background: isActive ? 'rgba(0,230,118,0.08)' : 'transparent',
    transition: '0.2s', fontSize: '0.92rem', fontWeight: isActive ? 600 : 400, gap: 16,
  });

  const asideStyle = {
    width: 250, background: '#0c0c0c', padding: '20px 0',
    height: fixed ? 'calc(100vh - 56px)' : 'calc(100vh - 56px)',
    position: fixed ? 'sticky' : 'fixed', top: fixed ? 0 : 56, left: 0, zIndex: 150,
    overflowY: 'auto', borderRight: '1px solid rgba(255,255,255,0.06)',
    transform: fixed ? 'none' : (open ? 'translateX(0)' : 'translateX(-280px)'),
    transition: fixed ? 'none' : 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
  };

  return (
    <>
      {!fixed && open && <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:140 }} />}
      <aside style={asideStyle}>
        <NavLink to="/" end onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHome color={isActive ? '#00e676' : '#aaa'} /> Início</>}
        </NavLink>
        <NavLink to="/explore" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconExplore color={isActive ? '#00e676' : '#aaa'} /> Explorar</>}
        </NavLink>
        <NavLink to="/shorts" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconShorts color={isActive ? '#00e676' : '#aaa'} /> Shorts</>}
        </NavLink>
        <NavLink to="/subscriptions" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconSubscriptions color={isActive ? '#00e676' : '#aaa'} /> Inscrições</>}
        </NavLink>
        {user && (
          <NavLink to={`/channel/${user.id}`} onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
            {({isActive}) => <><IconChannel color={isActive ? '#00e676' : '#aaa'} /> Meu canal</>}
          </NavLink>
        )}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'12px 14px' }} />
        <NavLink to="/library" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconLibrary color={isActive ? '#00e676' : '#aaa'} /> Biblioteca</>}
        </NavLink>
        <NavLink to="/history" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHistory color={isActive ? '#00e676' : '#aaa'} /> Histórico</>}
        </NavLink>
        <NavLink to="/liked" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconLiked color={isActive ? '#00e676' : '#aaa'} /> Curtidos</>}
        </NavLink>
      </aside>
    </>
  );
}
