import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function SubscribeButton({ channelId }) {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(false);

  const toggle = async () => {
    if (!user) return;
    const res = await axios.post(`${API}/users/subscribe`, { subscriber_id: user.id, channel_id: channelId });
    setSubscribed(res.data.subscribed);
  };

  return (
    <button onClick={toggle} className={`btn ${subscribed ? 'btn-primary' : 'btn-outline'}`}>
      {subscribed ? 'Inscrito ✓' : 'Inscrever-se'}
    </button>
  );
}
