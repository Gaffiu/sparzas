import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Subscriptions() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    if (user) axios.get(`${API}/users/${user.id}/feed`).then(res => setVideos(res.data));
  }, [user]);
  return (
    <div className="fade-in">
      <h2 style={{ marginBottom: 20 }}>📺 Inscrições</h2>
      <div className="video-grid">
        {videos.map(v => <VideoCard key={v.id} video={v} />)}
      </div>
    </div>
  );
}
