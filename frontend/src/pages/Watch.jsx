import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/videos/${id}`).then(res => setVideo(res.data));
  }, [id]);

  if (!video) return <p>Carregando...</p>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', marginBottom: 24 }}>
        <video controls src={video.video_url} style={{ width: '100%', display: 'block' }} />
      </div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 16 }}>{video.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#252525' }} />
          <div>
            <strong>{video.profiles?.username || 'Usuário'}</strong>
            <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{video.views} visualizações</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={btnStyle}>👍 Curtir</button>
          <button style={btnStyle}>🔗 Compartilhar</button>
        </div>
      </div>
      <div style={{ background: '#0f0f0f', padding: 20, borderRadius: 16, marginBottom: 20 }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{video.description || 'Sem descrição'}</p>
      </div>
      {/* Comentários placeholder */}
      <h3>Comentários</h3>
      <p style={{ color: '#888' }}>Em breve...</p>
    </div>
  );
}

const btnStyle = {
  background: 'transparent',
  border: '1px solid #333',
  color: '#fff',
  padding: '8px 18px',
  borderRadius: 24,
  cursor: 'pointer',
  fontWeight: 500,
};
