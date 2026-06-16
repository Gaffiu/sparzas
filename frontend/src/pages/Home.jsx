import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');
  const [pullDown, setPullDown] = useState(false);
  const touchStartY = useRef(0);

  const fetchVideos = () => {
    setLoading(true);
    const endpoint = search ? `${API}/videos?search=${search}` : `${API}/videos`;
    axios.get(endpoint).then(res => setVideos(res.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchVideos(); }, [search]);

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };
  const handleTouchMove = (e) => {
    if (window.scrollY === 0) {
      const pull = e.touches[0].clientY - touchStartY.current;
      if (pull > 40) setPullDown(true);
      else setPullDown(false);
    }
  };
  const handleTouchEnd = () => {
    if (pullDown) {
      fetchVideos();
      setPullDown(false);
    }
  };

  if (loading) return (
    <div className="video-grid" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {Array(8).fill().map((_,i) => <div key={i} className="skeleton-card"><div className="skeleton" style={{height:160}} /><div className="skeleton" style={{height:20, width:'60%', marginTop:8}} /></div>)}
    </div>
  );

  return (
    <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {pullDown && <div style={{ textAlign: 'center', padding: 8 }}>⏳ Solte para atualizar</div>}
      {search && <h2>Resultados para "{search}"</h2>}
      {videos.length === 0 ? <p style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>Nenhum vídeo encontrado.</p> :
        <div className="video-grid">{videos.map((v,i) => <VideoCard key={v.id} video={v} index={i} />)}</div>
      }
    </div>
  );
}
