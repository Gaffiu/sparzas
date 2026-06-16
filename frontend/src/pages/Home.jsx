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
    axios.get(endpoint).then(res => setVideos(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [search]);

  if (loading) {
    return (
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
        {Array(8).fill().map((_, i) => (
          <div key={i} style={{ background:'#0f0f0f', borderRadius:16, paddingTop:'56.25%', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)', backgroundSize:'400% 100%', animation:'shimmer 2s infinite' }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {search && <h2 style={{ marginBottom:20, fontSize:'1.5rem', fontWeight:600 }}>Resultados para &quot;{search}&quot;</h2>}
      {videos.length === 0 ? (
        <div style={{ textAlign:'center', marginTop:80, color:'#888' }}>
          <h2 style={{ fontWeight:400 }}>Nenhum video encontrado</h2>
          <p>Seja o primeiro a publicar algo incrivel.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
