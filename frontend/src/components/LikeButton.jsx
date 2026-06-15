import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function LikeButton({ videoId, initialLiked }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [animate, setAnimate] = useState(false);

  const toggleLike = async () => {
    if (!user) return;
    try {
      const res = await axios.post(`${API}/videos/${videoId}/like`, { user_id: user.id });
      setLiked(res.data.liked);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`btn-outline ${animate ? 'like-animate' : ''}`}
      style={{ color: liked ? 'var(--accent)' : undefined }}
    >
      {liked ? '👍' : '👍🏾'} {liked ? 'Curtido' : 'Curtir'}
    </button>
  );
}
