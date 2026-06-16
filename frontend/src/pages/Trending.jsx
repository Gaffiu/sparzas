import { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Trending() {
  const [videos, setVideos] = useState([]);
  useEffect(() => {
    axios.get(`${API}/videos`).then(res => setVideos(res.data.sort(() => 0.5 - Math.random()).slice(0, 20)));
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Em alta</h2>
      <div className="video-grid">{videos.map(v => <VideoCard key={v.id} video={v} />)}</div>
    </div>
  );
}
