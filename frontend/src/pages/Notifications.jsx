import { useState, useEffect } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // Simula notificações carregadas
    setNotifications([
      { id: 1, text: 'Canal SPARZAS postou um novo vídeo.', time: '2h atrás' },
      { id: 2, text: 'Seu vídeo atingiu 100 visualizações!', time: '5h atrás' },
    ]);
  }, []);

  return (
    <div>
      <h2>Notificações</h2>
      {notifications.length === 0 ? <p style={{ color: '#888' }}>Nenhuma notificação.</p> :
        notifications.map(n => (
          <div key={n.id} style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ margin: 0 }}>{n.text}</p>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>{n.time}</span>
          </div>
        ))
      }
    </div>
  );
}
