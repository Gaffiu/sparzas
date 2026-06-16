import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

export default function Sidebar({ open, close, fixed }) {
  const { user } = useAuth();
  const { playClick } = useSound();

  const handleClick = () => { close(); playClick(); };

  const linkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', padding: '12px 20px', margin: '4px 10px',
    borderRadius: 10, textDecoration: 'none', color: isActive ? '#00e676' : '#aaa',
    background: isActive ? '#1a1a1a' : 'transparent', transition: '0.2s', fontSize: '0.95rem',
    fontWeight: isActive ? 600 : 400,
  });

  const asideStyle = {
    width: 260, background: '#0c0c0c', padding: '24px 0',
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
      {!fixed && open && <div onClick={close} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:140 }} />}
      <aside style={asideStyle}>
        <NavLink to="/" end onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>Início</NavLink>
        <NavLink to="/subscriptions" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>Inscrições</NavLink>
        {user && <NavLink to={`/channel/${user.id}`} onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>Meu canal</NavLink>}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', margin:'12px 14px' }} />
        <NavLink to="/liked" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>Curtidos</NavLink>
        <NavLink to="/history" onClick={handleClick} style={({isActive}) => linkStyle(isActive)}>Histórico</NavLink>
      </aside>
    </>
  );
}
