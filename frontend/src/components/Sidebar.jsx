import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconSubscriptions, IconChannel, IconLiked, IconHistory } from './Icons';

export default function Sidebar({ open, close, fixed }) {
  const { user } = useAuth();
  const { playClick } = useSound();

  const handleClick = () => { close(); playClick(); };

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', padding: '10px 20px', margin: '2px 10px',
    borderRadius: 10, textDecoration: 'none', color: isActive ? '#00e676' : '#aaa',
    background: isActive ? '#1a1a1a' : 'transparent', transition: '0.2s', fontSize: '0.9rem',
    fontWeight: isActive ? 600 : 400, gap: 14,
  });

  const iconColor = (isActive) => isActive ? '#00e676' : '#aaa';

  const asideStyle = {
    width: 240, background: '#0c0c0c', padding: '20px 0',
    height: fixed ? 'calc(100vh - 64px)' : 'calc(100vh - 64px)',
    position: fixed ? 'sticky' : 'fixed',
    top: fixed ? 0 : 64,
    left: 0, zIndex: 150, overflowY: 'auto',
    borderRight: '1px solid rgba(255,255,255,0.04)',
    transform: fixed ? 'none' : (open ? 'translateX(0)' : 'translateX(-280px)'),
    transition: fixed ? 'none' : 'transform 0.3s ease',
  };

  return (
    <>
      {!fixed && open && <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:140 }} />}
      <aside style={asideStyle}>
        <NavLink to="/" end onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHome color={iconColor(isActive)} /> Início</>}
        </NavLink>
        <NavLink to="/subscriptions" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconSubscriptions color={iconColor(isActive)} /> Inscrições</>}
        </NavLink>
        {user && (
          <NavLink to={`/channel/${user.id}`} onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
            {({isActive}) => <><IconChannel color={iconColor(isActive)} /> Meu canal</>}
          </NavLink>
        )}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', margin:'10px 14px' }} />
        <NavLink to="/liked" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconLiked color={iconColor(isActive)} /> Curtidos</>}
        </NavLink>
        <NavLink to="/history" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>
          {({isActive}) => <><IconHistory color={iconColor(isActive)} /> Histórico</>}
        </NavLink>
      </aside>
    </>
  );
}
