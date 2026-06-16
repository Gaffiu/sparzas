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
  const [playlists, setPlaylists] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API}/users/${id}`).then(res => { setProfile(res.data.profile); setVideos(res.data.videos); });
    axios.get(`${API}/users/${id}/playlists`).then(res => setPlaylists(res.data));
    axios.get(`${API}/users/${id}/badges`).then(res => setBadges(res.data));
    setLoading(false);
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!profile) return <p style={{ textAlign:'center', color:'#888' }}>Canal não encontrado.</p>;

  return (
    <div>
      {/* Banner simulado */}
      <div style={{ height: 120, background: 'linear-gradient(135deg, #0a1a0a, #0f2a0f)', borderRadius: 16, marginBottom: -30 }} />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingLeft: 20, marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#252525', border: '3px solid #0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#00e676' }}>
          {profile.username?.[0]?.toUpperCase() || 'S'}
        </div>
        <div>
          <h1 style={{ margin: 0 }}>{profile.username}</h1>
          <p style={{ color: '#888', margin: '4px 0' }}>{videos.length} vídeos · {playlists.length} playlists</p>
          {user && user.id !== profile.id && <SubscribeButton channelId={profile.id} />}
          {badges.length > 0 && <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>{badges.map(b => <span key={b.id} style={{ background: '#333', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>{b.badge_type}</span>)}</div>}
        </div>
      </div>
      <h2>Vídeos</h2>
      <div className="video-grid">{videos.map(v => <VideoCard key={v.id} video={v} />)}</div>
      {playlists.length > 0 && (
        <>
          <h2 style={{ marginTop: 24 }}>Playlists</h2>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
            {playlists.map(pl => <div key={pl.id} style={{ minWidth: 200, padding: 16, background: '#0f0f0f', borderRadius: 12 }}><strong>{pl.name}</strong></div>)}
          </div>
        </>
      )}
    </div>
  );
}
