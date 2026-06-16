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
    const endpoint = search ? `${API}/videos?search=${search}` : `${API}/videos`;
    axios.get(endpoint).then(res => setVideos(res.data)).finally(() => setLoading(false));
  }, [search]);

  if (loading) return <p>Carregando...</p>;

  return (
    <div>
      {search && <h2 style={{ marginBottom: 20 }}>Resultados para: "{search}"</h2>}
      {videos.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 80, color: '#888' }}>Nenhum vídeo encontrado</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
