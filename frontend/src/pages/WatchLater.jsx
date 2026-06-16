import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';

export default function WatchLater() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    setVideos(stored);
  }, []);

  const removeAll = () => {
    localStorage.removeItem('sparzas_watch_later');
    setVideos([]);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>Assistir mais tarde</h2>
        {videos.length > 0 && (
          <button onClick={removeAll} style={{
            background:'transparent', border:'1px solid #333', color:'#fff',
            padding:'6px 16px', borderRadius:20, fontSize:'0.85rem', cursor:'pointer',
          }}>Limpar tudo</button>
        )}
      </div>
      {videos.length === 0 ? (
        <p style={{ color:'#888' }}>Nenhum vídeo salvo.</p>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
