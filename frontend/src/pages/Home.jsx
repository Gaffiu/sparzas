import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  useEffect(() => {
    setLoading(true);
    const endpoint = search ? `${API}/videos?search=${encodeURIComponent(search)}` : `${API}/videos`;
    axios.get(endpoint)
      .then(res => setVideos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search]);

  if (loading) {
    return (
      <div className="video-grid">
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="video-card">
            <div className="skeleton" style={{ paddingTop: '56.25%' }} />
            <div style={{ padding: 16, display: 'flex', gap: 12 }}>
              <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {search && <h2 style={{ marginBottom: 20 }}>Resultados para: "{search}"</h2>}
      {videos.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Nenhum vídeo encontrado</h2>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((video, i) => (
            <div key={video.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
