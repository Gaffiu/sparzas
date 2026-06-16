import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

export default function Navbar({ toggleSidebar }) {
  const [search, setSearch] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="navbar fade-in">
      <button className="nav-btn" onClick={toggleSidebar} aria-label="Menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>
      <Link to="/" className="navbar-logo">
        <Logo />
        <span>SPARZAS</span>
      </Link>
      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <input type="text" placeholder="Pesquisar vídeos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="submit" className="search-btn">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6"/><path d="M14 14l5 5"/></svg>
          </button>
        </form>
      </div>
      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/upload" className="nav-btn" title="Enviar vídeo">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            </Link>
            <Link to={`/channel/${user.id}`} className="nav-btn" title="Meu canal">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
            </Link>
            <button onClick={logout} className="btn btn-outline" style={{padding: '6px 14px', fontSize: '0.85rem'}}>Sair</button>
          </>
        ) : (
          <Link to="/login" className="btn-entrar">Entrar</Link>
        )}
      </div>
    </nav>
  );
}
