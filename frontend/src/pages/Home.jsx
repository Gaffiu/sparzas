import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  
  useEffect(() => {
    axios.get(`${API_URL}/videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error('Erro ao buscar vídeos:', err));
  }, []);
  
  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>🎥 SPARZAS</h1>
      <p>Bem-vindo à plataforma!</p>
      {videos.length === 0 ? (
        <p>Nenhum vídeo ainda. Seja o primeiro a enviar!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {videos.map(video => (
            <div key={video.id}>
              <a href={`/watch/${video.id}`}>
                <img
                  src={video.thumbnail_url || 'https://via.placeholder.com/320x180'}
                  width="100%"
                  alt={video.title}
                />
                <p>{video.title}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}