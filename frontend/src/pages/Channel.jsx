import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import SubscribeButton from '../components/SubscribeButton';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Channel() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    axios.get(`${API}/users/${id}`)
      .then(res => {
        setProfile(res.data.profile);
        setVideos(res.data.videos);
        setError('');
      })
      .catch(() => setError('Canal não encontrado.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>{error}</div>;
  if (!profile) return <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Perfil não encontrado.</div>;

  return (
    <div>
      <div style={{ background: '#0f0f0f', padding: 20, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#252525', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#00e676' }}>
          {profile.username?.[0]?.toUpperCase() || 'S'}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{profile.username || 'Usuário'}</h1>
          <p style={{ color: '#888', margin: '4px 0' }}>{videos.length} vídeos</p>
          {user && user.id !== profile.id && <SubscribeButton channelId={profile.id} />}
        </div>
      </div>
      <div className="video-grid">
        {videos.map(v => <VideoCard key={v.id} video={v} index={0} />)}
      </div>
    </div>
  );
}
