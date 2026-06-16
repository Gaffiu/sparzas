import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconSubscriptions, IconUpload, IconExplore, IconLibrary } from './Icons';

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { playClick } = useSound();

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

  const tabs = [
    { path: '/', icon: IconHome, label: 'Início' },
    { path: '/explore', icon: IconExplore, label: 'Explorar' },
    { path: '/upload', icon: IconUpload, label: 'Publicar', requireAuth: true },
    { path: '/subscriptions', icon: IconSubscriptions, label: 'Inscrições' },
    { path: '/library', icon: IconLibrary, label: 'Biblioteca' },
  ];

  const handleTab = (tab) => {
    vibrate(); playClick();
    if (tab.requireAuth && !user) { navigate('/login'); }
    else { navigate(tab.path); }
  };

  return (
    <nav className="mobile-tab-bar">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const IconComponent = tab.icon;
        return (
          <button key={tab.path} onClick={() => handleTab(tab)} className={`tab-btn ${isActive ? 'active' : ''}`}>
            <IconComponent size={22} color={isActive ? '#00e676' : '#888'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
