import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ open, close }) {
  const { user } = useAuth();
  return (
    <>
      {/* Overlay para mobile */}
      {open && <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', zIndex:140}} onClick={close} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" end className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} onClick={close}><span className="sidebar-icon">🏠</span> Início</NavLink>
        <NavLink to="/subscriptions" className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} onClick={close}><span className="sidebar-icon">📺</span> Inscrições</NavLink>
        {user && (
          <NavLink to={`/channel/${user.id}`} className={({isActive}) => `sidebar-item ${isActive ? 'active' : ''}`} onClick={close}><span className="sidebar-icon">👤</span> Meu canal</NavLink>
        )}
        <div style={{borderTop:'1px solid var(--border-subtle)', margin:'10px 12px'}} />
        <NavLink to="/liked" className="sidebar-item" onClick={close}><span className="sidebar-icon">👍</span> Curtidos</NavLink>
        <NavLink to="/history" className="sidebar-item" onClick={close}><span className="sidebar-icon">🕘</span> Histórico</NavLink>
      </aside>
    </>
  );
}
