import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ open }) {
  const { user } = useAuth();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        <span className="icon">🏠</span> Início
      </NavLink>
      <NavLink to="/subscriptions">
        <span className="icon">📺</span> Inscrições
      </NavLink>
      {user && (
        <NavLink to={`/channel/${user.id}`}>
          <span className="icon">👤</span> Meu canal
        </NavLink>
      )}
      <hr style={{ borderColor: '#333', margin: '8px 0' }} />
      <NavLink to="/liked">
        <span className="icon">👍</span> Vídeos curtidos
      </NavLink>
      <NavLink to="/history">
        <span className="icon">🕘</span> Histórico
      </NavLink>
    </aside>
  );
}
