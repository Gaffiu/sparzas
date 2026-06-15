import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/videos`)
      .then(res => setVideos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="video-grid">{Array(6).fill(0).map((_,i) => <div key={i} className="video-card"><div className="skeleton" style={{height:160}}/><div style={{padding:12}}><div className="skeleton" style={{height:20, width:'80%'}}/></div></div>)}</div>;
  }

  return (
    <div className="fadeIn">
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <h2>🎥 Nenhum vídeo ainda.</h2>
          {user ? <p>Seja o primeiro a enviar!</p> : <p>Faça login para começar.</p>}
        </div>
      ) : (
        <div className="video-grid">
          {videos.map(video => <VideoCard key={video.id} video={video} />)}
        </div>
      )}
    </div>
  );
}
