import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Category() {
  const { slug } = useParams();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    // Simula categorias – no futuro, pode filtrar por tag
    axios.get(`${API}/videos`).then(res => setVideos(res.data));
  }, [slug]);

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>{slug?.toUpperCase()}</h2>
      <div className="video-grid">{videos.slice(0, 20).map(v => <VideoCard key={v.id} video={v} />)}</div>
    </div>
  );
}
