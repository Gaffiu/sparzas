import { useState } from 'react';
export default function Sessions() {
  const [sessions] = useState([{ device: 'iPhone 15 Pro', lastActive: 'Agora' }]);
  return (
    <div><h2>Dispositivos conectados</h2>
      {sessions.map((s, i) => <div key={i} style={{ padding: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.device} – {s.lastActive}</div>)}
    </div>
  );
}
