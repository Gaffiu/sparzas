import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Channel() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${API}/users/${id}`).then(res => {
      setProfile(res.data.profile);
      setVideos(res.data.videos);
    }).catch(() => {});
  }, [id]);

  if (!profile) return <div style={{ textAlign:'center', padding:40, color:'#aaa' }}>Carregando canal...</div>;

  return (
    <div>
      <div style={{ background:'#0f0f0f', padding:24, borderRadius:20, display:'flex', alignItems:'center', gap:20, marginBottom:32, border:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'#202020' }} />
        <div>
          <h1 style={{ fontSize:'1.6rem', margin:0 }}>{profile.username}</h1>
          <p style={{ color:'#888', margin:'4px 0 0' }}>{videos.length} videos</p>
        </div>
      </div>
      <h2 style={{ marginBottom:20, fontSize:'1.4rem' }}>Videos do canal</h2>
      {videos.length === 0 ? <p style={{ color:'#888' }}>Nenhum video publicado.</p> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
