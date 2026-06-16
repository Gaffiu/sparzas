import { useState } from 'react';

export default function Messages() {
  const [conversations] = useState([
    { id: 1, user: 'Criador X', lastMessage: 'Obrigado pelo apoio!', time: '10:30' },
  ]);

  return (
    <div>
      <h2>Mensagens</h2>
      {conversations.map(conv => (
        <div key={conv.id} className="message-preview">
          <div className="msg-avatar">{conv.user[0]}</div>
          <div>
            <strong>{conv.user}</strong>
            <p>{conv.lastMessage}</p>
            <span>{conv.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
