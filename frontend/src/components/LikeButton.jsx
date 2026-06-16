import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function LikeButton({ videoId, initialLiked }) {
  const [liked, setLiked] = useState(initialLiked);
  const [burst, setBurst] = useState(false);
  const { user } = useAuth();

  const toggleLike = async () => {
    if (!user) return;
    setBurst(true);
    setTimeout(() => setBurst(false), 300);
    try {
      const res = await axios.post(`${API}/videos/${videoId}/like`, { user_id: user.id });
      setLiked(res.data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`btn ${liked ? 'btn-primary' : 'btn-outline'} ${burst ? 'like-animate' : ''}`}
      style={burst ? { animation: 'likeBurst 0.3s ease' } : {}}
    >
      {liked ? '👍' : '👍🏾'} {liked ? 'Curtido' : 'Curtir'}
    </button>
  );
}
