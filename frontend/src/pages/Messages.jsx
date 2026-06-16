import { useState } from 'react';

export default function Messages() {
  const [conversations] = useState([
    { id: 1, user: 'Criador X', lastMessage: 'Obrigado pelo apoio!', time: '10:30' },
    { id: 2, user: 'Canal Y', lastMessage: 'Novo vídeo em breve...', time: 'Ontem' },
  ]);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Mensagens</h2>
      {conversations.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhuma conversa ainda.</p>
      ) : (
        conversations.map(conv => (
          <div key={conv.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: '#333',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, color: '#fff'
            }}>
              {conv.user[0]}
            </div>
            <div style={{ flex: 1 }}>
              <strong>{conv.user}</strong>
              <p style={{ margin: 4, fontSize: '0.9rem', color: '#aaa' }}>{conv.lastMessage}</p>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>{conv.time}</span>
          </div>
        ))
      )}
    </div>
  );
}
