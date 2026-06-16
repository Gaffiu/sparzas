import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Studio() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/users/${user.id}`).then(res => {
      const vids = res.data.videos || [];
      setVideos(vids);
      setTotalViews(vids.reduce((sum, v) => sum + (v.views || 0), 0));
    }).catch(() => {});
  }, [user]);

  if (!user) return <div style={{ textAlign:'center', marginTop:80, color:'#888' }}>Faça login para acessar o estúdio.</div>;

  return (
    <div>
      <h1 style={{ fontSize:'1.8rem', marginBottom:24 }}>Estúdio de Criação</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:16, marginBottom:32 }}>
        <div style={cardStyle}>
          <p style={{ color:'#888', margin:0 }}>Total de vídeos</p>
          <h2 style={{ margin:'8px 0 0' }}>{videos.length}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color:'#888', margin:0 }}>Visualizações</p>
          <h2 style={{ margin:'8px 0 0' }}>{totalViews}</h2>
        </div>
        <div style={cardStyle}>
          <p style={{ color:'#888', margin:0 }}>Likes</p>
          <h2 style={{ margin:'8px 0 0' }}>{totalLikes}</h2>
        </div>
      </div>
      <h2 style={{ marginBottom:16 }}>Seus vídeos</h2>
      {videos.length === 0 ? (
        <p style={{ color:'#888' }}>Nenhum vídeo publicado.</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:16 }}>
          {videos.map(v => (
            <div key={v.id} style={{ background:'#0f0f0f', borderRadius:12, padding:16 }}>
              <h3 style={{ fontSize:'1rem', marginBottom:8 }}>{v.title}</h3>
              <p style={{ color:'#888', fontSize:'0.85rem' }}>{v.views || 0} visualizações</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: '#0f0f0f', borderRadius: 12, padding: 20,
  border: '1px solid rgba(255,255,255,0.04)',
};
