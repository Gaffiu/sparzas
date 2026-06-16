import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

export default function Shorts() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/videos`).then(res => {
      // Filtra vídeos que possam ser shorts (ex.: duração menor que 60s? Aqui simulamos)
      setVideos(res.data.filter(v => v.title.length < 30));
    });
  }, []);

  const handleScroll = (e) => {
    const delta = e.deltaY || e.touches?.[0]?.clientY;
    if (delta > 50 && current < videos.length - 1) setCurrent(prev => prev + 1);
    else if (delta < -50 && current > 0) setCurrent(prev => prev - 1);
  };

  if (videos.length === 0) return <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Nenhum short disponível.</div>;

  const video = videos[current];

  return (
    <div
      style={{ height: 'calc(100vh - 56px)', overflow: 'hidden', background: '#000', position: 'relative' }}
      onWheel={handleScroll}
      onTouchEnd={handleScroll}
    >
      <video
        src={video.video_url}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        autoPlay
        loop
        controls
      />
      <div style={{ position: 'absolute', bottom: 20, left: 16, color: '#fff' }}>
        <h3>{video.title}</h3>
        <p>{video.profiles?.username}</p>
      </div>
      <button
        onClick={() => navigate(`/watch/${video.id}`)}
        style={{ position: 'absolute', bottom: 20, right: 16, background: '#00e676', color: '#000', border: 'none', padding: '8px 16px', borderRadius: 20 }}
      >
        Ver vídeo
      </button>
    </div>
  );
}
