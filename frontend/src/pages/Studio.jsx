import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Studio() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/users/${user.id}`).then(res => setVideos(res.data.videos));
    // Simula ganhos
    const totalViews = (videos || []).reduce((s, v) => s + (v.views || 0), 0);
    setEarnings((totalViews * 0.002).toFixed(2));
  }, [user]);

  if (!user) return <p style={{ textAlign:'center', color:'#888' }}>Faça login.</p>;

  return (
    <div>
      <h2>Estúdio de Criação</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, background: '#0f0f0f', padding: 20, borderRadius: 12 }}>
          <p style={{ color: '#888' }}>Total de vídeos</p>
          <h3>{videos.length}</h3>
        </div>
        <div style={{ flex: 1, background: '#0f0f0f', padding: 20, borderRadius: 12 }}>
          <p style={{ color: '#888' }}>Ganhos estimados</p>
          <h3>R$ {earnings}</h3>
        </div>
      </div>
      <h3>Seus vídeos</h3>
      {videos.map(v => <div key={v.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{v.title} – {v.views} views</div>)}
    </div>
  );
}
