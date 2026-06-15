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
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="navbar">
      <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', marginRight: 16 }}>
        ☰
      </button>
      <Link to="/"><Logo /></Link>

      <form className="search-box" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pesquisar vídeos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className="user-section">
        {user ? (
          <>
            <Link to={`/channel/${user.id}`}>🎬</Link>
            <Link to="/upload" style={{ color: 'var(--accent)' }}>+ Enviar</Link>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>Sair</button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ padding: '6px 16px' }}>Entrar</Link>
        )}
      </div>
    </nav>
  );
}
