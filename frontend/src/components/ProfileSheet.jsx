import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

export default function ProfileSheet({ user, onClose }) {
  const { logout } = useAuth();
  const { playClick } = useSound();
  const navigate = useNavigate();

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

  const handleAction = (path) => {
    vibrate(); playClick();
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    vibrate(); playClick();
    onClose();
    navigate('/');
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-container" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <div className="sheet-avatar">{user?.email?.[0].toUpperCase()}</div>
          <div>
            <p className="sheet-email">{user?.email}</p>
            <button onClick={() => handleAction(`/channel/${user.id}`)} className="sheet-channel-btn">Ver canal</button>
          </div>
        </div>
        <div className="sheet-options">
          <button onClick={() => handleAction(`/channel/${user.id}`)} className="sheet-option">Meu canal</button>
          <button onClick={() => handleAction('/studio')} className="sheet-option">Estúdio de Criação</button>
          <button onClick={() => handleAction('/watch-later')} className="sheet-option">Assistir mais tarde</button>
          <button onClick={() => handleAction('/history')} className="sheet-option">Histórico</button>
          <button onClick={() => handleAction('/liked')} className="sheet-option">Vídeos curtidos</button>
          <button onClick={() => handleAction('/playlists')} className="sheet-option">Playlists</button>
          <button onClick={() => handleAction('/messages')} className="sheet-option">Mensagens</button>
        </div>
        <button onClick={handleLogout} className="sheet-logout">Sair</button>
        <button onClick={onClose} className="sheet-cancel">Cancelar</button>
      </div>
    </div>
  );
}
