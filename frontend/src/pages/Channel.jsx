import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import SubscribeButton from '../components/SubscribeButton';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function Channel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/users/${id}`)
      .then(res => {
        setChannel(res.data.profile);
        setVideos(res.data.videos);
      })
      .catch(console.error);
  }, [id]);

  if (!channel) return <div className="fadeIn">Carregando...</div>;

  return (
    <div className="fadeIn">
      <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 12, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <img src={channel.avatar_url || 'https://via.placeholder.com/80'} style={{ width: 80, height: 80, borderRadius: '50%' }} alt="" />
        <div>
          <h1>{channel.username}</h1>
          {user && user.id !== channel.id && <SubscribeButton channelId={channel.id} />}
        </div>
      </div>
      <h2>Vídeos</h2>
      <div className="video-grid">
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}
