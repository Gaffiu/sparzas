import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { IconHome, IconSubscriptions, IconUpload, IconChannel, IconLiked, IconHistory } from './Icons';
import ProfileSheet from './ProfileSheet';

export default function MobileTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { playClick } = useSound();
  const [sheetOpen, setSheetOpen] = useState(false);

  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

  const tabs = [
    { path: '/', icon: IconHome, label: 'Início' },
    { path: '/subscriptions', icon: IconSubscriptions, label: 'Inscrições' },
    { path: '/upload', icon: IconUpload, label: 'Publicar', requireAuth: true },
  ];

  const handleTab = (tab) => {
    vibrate(); playClick();
    if (tab.requireAuth && !user) {
      navigate('/login');
    } else {
      navigate(tab.path);
    }
  };

  const handleProfile = () => {
    vibrate(); playClick();
    if (!user) {
      navigate('/login');
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <>
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
        <button onClick={handleProfile} className={`tab-btn ${sheetOpen ? 'active' : ''}`}>
          <div className="profile-avatar-small">
            {user ? user.email[0].toUpperCase() : '?'}
          </div>
          <span>Perfil</span>
        </button>
      </nav>
      {sheetOpen && <ProfileSheet user={user} onClose={() => setSheetOpen(false)} />}
    </>
  );
}
