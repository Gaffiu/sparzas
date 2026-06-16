import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Channel() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios.get(`${API}/users/${id}`).then(res => { setChannel(res.data.profile); setVideos(res.data.videos); });
  }, [id]);

  if (!channel) return <p>Carregando...</p>;

  return (
    <div>
      <div style={{ background: '#0f0f0f', padding: 24, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#252525' }} />
        <h1>{channel.username}</h1>
      </
