import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const touchStart = useRef(0);

  const fetchVideos = () => {
    const endpoint = search ? `${API}/videos?search=${search}` : `${API}/videos`;
    axios.get(endpoint).then(res => setVideos(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchVideos();
  }, [search]);

  const handlePullRefresh = (e) => {
    if (window.scrollY === 0) {
      touchStart.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (window.scrollY === 0 && e.changedTouches[0].clientY - touchStart.current > 100) {
      setRefreshing(true);
      setTimeout(() => {
        fetchVideos();
        setRefreshing(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="video-grid">
        {Array(8).fill().map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-thumb" />
            <div className="skeleton-info">
              <div className="skeleton-avatar" />
              <div className="skeleton-text">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div onTouchStart={handlePullRefresh} onTouchEnd={handleTouchEnd}>
      {refreshing && <div className="pull-indicator">Atualizando...</div>}
      {search && <h2>Resultados para: "{search}"</h2>}
      {videos.length === 0 ? (
        <div className="empty-state">Nenhum vídeo encontrado.</div>
      ) : (
        <div className="video-grid">
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
