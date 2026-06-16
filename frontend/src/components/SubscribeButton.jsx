import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

const API = import.meta.env.VITE_API_URL;

export default function SubscribeButton({ channelId }) {
  const { user } = useAuth();
  const { playClick } = useSound();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !channelId) return;
    axios.get(`${API}/users/subscribe/status`, {
      params: { subscriber_id: user.id, channel_id: channelId }
    }).then(res => setSubscribed(res.data.subscribed))
      .finally(() => setLoading(false));
  }, [user, channelId]);

  const toggle = async () => {
    if (!user) return;
    playClick();
    if (navigator.vibrate) navigator.vibrate(10);
    const res = await axios.post(`${API}/users/subscribe`, {
      subscriber_id: user.id,
      channel_id: channelId
    });
    setSubscribed(res.data.subscribed);
  };

  if (loading || !user || user.id === channelId) return null;

  return (
    <button onClick={toggle} style={{
      background: subscribed ? '#00e676' : 'transparent',
      border: subscribed ? 'none' : '1px solid #333',
      color: subscribed ? '#000' : '#fff',
      padding: '8px 18px', borderRadius: 24, fontWeight: 600,
      fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s',
    }}>
      {subscribed ? 'Inscrito ✓' : 'Inscrever-se'}
    </button>
  );
}
