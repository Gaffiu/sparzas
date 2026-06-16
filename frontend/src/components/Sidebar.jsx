import { NavLink } from 'react-router-dom';

export default function Sidebar({ open, close, user }) {
  return (
    <>
      {open && <div onClick={close} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', zIndex:140 }} />}
      <aside style={{
        width: 260,
        background: '#0f0f0f',
        padding: '20px 0',
        height: 'calc(100vh - 60px)',
        position: 'sticky',
        top: 60,
        overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        transition: 'transform 0.3s ease',
        transform: open ? 'translateX(0)' : 'translateX(-280px)',
        position: 'fixed',
        left: 0,
        zIndex: 150,
      }}>
        <NavLink to="/" end onClick={close} style={linkStyle}>🏠 Início</NavLink>
        <NavLink to="/subscriptions" onClick={close} style={linkStyle}>📺 Inscrições</NavLink>
        {user && <NavLink to={`/channel/${user.id}`} onClick={close} style={linkStyle}>👤 Meu canal</NavLink>}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', margin:'10px 12px' }} />
        <NavLink to="/liked" onClick={close} style={linkStyle}>👍 Curtidos</NavLink>
        <NavLink to="/history" onClick={close} style={linkStyle}>🕘 Histórico</NavLink>
      </aside>
    </>
  );
}

const linkStyle = ({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  margin: '2px 8px',
  borderRadius: 10,
  textDecoration: 'none',
  color: isActive ? '#00e676' : '#b0b0b0',
  background: isActive ? '#1a1a1a' : 'transparent',
});
