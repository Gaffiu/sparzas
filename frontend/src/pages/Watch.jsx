import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import Player from '../components/Player';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playLike, playClick } = useSound();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    axios.get(`${API}/videos/${id}`)
      .then(res => { setVideo(res.data); setLoading(false); })
      .catch(() => { setError('Vídeo não encontrado.'); setLoading(false); });
    axios.get(`${API}/videos/${id}/likes/count`).then(res => setLikeCount(res.data.count)).catch(() => {});
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    if (navigator.vibrate) navigator.vibrate(15);
    playLike();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    axios.post(`${API}/videos/${id}/like`, { user_id: user.id }).catch(() => {});
  };

  const handleShare = () => {
    playClick();
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  const saveToWatchLater = () => {
    if (!video) return;
    if (navigator.vibrate) navigator.vibrate(10);
    playClick();
    const list = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    if (list.some(v => v.id === video.id)) {
      alert('Este vídeo já está na lista.');
      return;
    }
    list.push({
      id: video.id, title: video.title, thumbnail_url: video.thumbnail_url,
      profiles: video.profiles, views: video.views, created_at: video.created_at,
    });
    localStorage.setItem('sparzas_watch_later', JSON.stringify(list));
    alert('Salvo em "Assistir mais tarde"!');
  };

  useEffect(() => {
    if (!video) return;
    const history = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    const newEntry = { id: video.id, title: video.title, thumbnail_url: video.thumbnail_url, profiles: video.profiles, watchedAt: new Date().toISOString() };
    const filtered = history.filter(v => v.id !== video.id);
    filtered.unshift(newEntry);
    localStorage.setItem('sparzas_history', JSON.stringify(filtered.slice(0, 50)));
  }, [video]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><div className="spinner" /></div>;
  if (error) return <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}><h2>{error}</h2><Link to="/" style={{ color: '#00e676' }}>Voltar</Link></div>;
  if (!video) return <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}><h2>Vídeo não encontrado.</h2><Link to="/" style={{ color: '#00e676' }}>Voltar</Link></div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Player src={video.video_url} poster={video.thumbnail_url} onLike={toggleLike} liked={liked} likeCount={likeCount} onShare={handleShare} onPiP={() => {}} onTheater={() => {}} />
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8 }}>{video.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to={`/channel/${video.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#252525' }} />
            <div>
              <strong>{video.profiles?.username || 'SPARZAS'}</strong>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{video.views || 0} visualizações</p>
            </div>
          </Link>
          {user && <SubscribeButton channelId={video.user_id} />}
        </div>
        <button onClick={saveToWatchLater} className="btn btn-outline">+ Salvar</button>
      </div>
      <div style={{ background: '#0f0f0f', padding: 16, borderRadius: 12, marginBottom: 28, whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: '0.95rem' }}>{video.description || 'Sem descrição.'}</div>
      <CommentSection videoId={video.id} />
    </div>
  );
}
