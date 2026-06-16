import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconSubscriptions, IconUpload, IconChannel } from './Icons';

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { playClick } = useSound();

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

  const tabs = [
    { path: '/', icon: IconHome, label: 'Início' },
    { path: '/subscriptions', icon: IconSubscriptions, label: 'Inscrições' },
    { path: '/upload', icon: IconUpload, label: 'Publicar', requireAuth: true },
    { path: user ? `/channel/${user.id}` : '/login', icon: IconChannel, label: 'Canal' },
  ];

  const handleTab = (tab) => {
    vibrate(); playClick();
    if (tab.requireAuth && !user) {
      navigate('/login');
    } else {
      navigate(tab.path);
    }
  };

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%', height: 64,
      background: 'rgba(12,12,12,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 200, paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => handleTab(tab)}
            style={{
              background: 'none', border: 'none', color: isActive ? '#00e676' : '#888',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontSize: '0.65rem', fontWeight: isActive ? 600 : 400,
              cursor: 'pointer', transition: 'color 0.2s', padding: '4px 12px',
              minWidth: 60,
            }}
          >
            <IconComponent size={22} color={isActive ? '#00e676' : '#888'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
