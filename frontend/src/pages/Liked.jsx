import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Liked() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    axios.get(`${API}/users/${user.id}/liked`)
      .then(res => setVideos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign:'center', marginTop:80, color:'#888' }}>
        <h2>Faça login para ver seus vídeos curtidos</h2>
      </div>
    );
  }

  if (loading) return <div style={{ textAlign:'center', padding:40 }}>Carregando...</div>;

  return (
    <div>
      <h2 style={{ marginBottom:24, fontSize:'1.5rem' }}>👍 Vídeos curtidos</h2>
      {videos.length === 0 ? (
        <div style={{ textAlign:'center', marginTop:60, color:'#888' }}>
          <p>Você ainda não curtiu nenhum vídeo.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
