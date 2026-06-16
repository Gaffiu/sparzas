import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { useMiniPlayer } from '../components/MiniPlayer';
import Player from '../components/Player';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';
import { IconLike, IconDislike, IconShare, IconPlaylistAdd } from '../components/Icons';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playLike, playClick } = useSound();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { setMiniPlayerVideo } = useMiniPlayer();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API}/videos/${id}`)
      .then(res => { setVideo(res.data); setLoading(false); })
      .catch(() => { setError('Vídeo não encontrado.'); setLoading(false); });
    axios.get(`${API}/videos/${id}/likes/count`)
      .then(res => setLikeCount(res.data.count));
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    if (navigator.vibrate) navigator.vibrate(15);
    playLike();
    setLiked(!liked);
    if (disliked) setDisliked(false);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    axios.post(`${API}/videos/${id}/like`, { user_id: user.id }).catch(() => {});
  };

  const toggleDislike = () => {
    if (!user) return;
    if (navigator.vibrate) navigator.vibrate(10);
    setDisliked(!disliked);
    if (liked) {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleShare = () => {
    playClick();
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  const saveToPlaylist = () => {
    if (!video) return;
    playClick();
    const name = prompt('Nome da playlist (deixe em branco para "Watch Later"):');
    if (name === null) return;
    const list = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    if (!list.some(v => v.id === video.id)) {
      list.push({ id: video.id, title: video.title, thumbnail_url: video.thumbnail_url, profiles: video.profiles });
      localStorage.setItem('sparzas_watch_later', JSON.stringify(list));
      alert('Salvo!');
    }
  };

  useEffect(() => {
    if (!video) return;
    const history = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    const newEntry = { id: video.id, title: video.title, thumbnail_url: video.thumbnail_url, profiles: video.profiles, watchedAt: new Date().toISOString() };
    const filtered = history.filter(v => v.id !== video.id);
    filtered.unshift(newEntry);
    localStorage.setItem('sparzas_history', JSON.stringify(filtered.slice(0, 50)));
    setMiniPlayerVideo(video);
  }, [video]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div style={{ textAlign:'center', padding:60, color:'#aaa' }}><h2>{error}</h2><Link to="/">Voltar</Link></div>;
  if (!video) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Player
        src={video.video_url}
        poster={video.thumbnail_url}
        onLike={toggleLike}
        liked={liked}
        likeCount={likeCount}
        onShare={handleShare}
        onPiP={() => {}}
        onTheater={() => {
          if (document.fullscreenElement) document.exitFullscreen();
          else document.body.requestFullscreen();
        }}
      />
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '12px 0' }}>{video.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to={`/channel/${video.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#252525' }} />
            <div>
              <strong>{video.profiles?.username || 'SPARZAS'}</strong>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>{video.views || 0} visualizações</p>
            </div>
          </Link>
          {user && user.id !== video.user_id && <SubscribeButton channelId={video.user_id} />}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={toggleLike} className={`btn-action ${liked ? 'active' : ''}`}>
            <IconLike size={16} color={liked ? '#000' : '#fff'} filled={liked} /> {likeCount}
          </button>
          <button onClick={toggleDislike} className={`btn-action ${disliked ? 'active' : ''}`}>
            <IconDislike size={16} color={disliked ? '#000' : '#fff'} filled={disliked} />
          </button>
          <button onClick={handleShare} className="btn-action"><IconShare size={16} /> Compartilhar</button>
          <button onClick={saveToPlaylist} className="btn-action"><IconPlaylistAdd size={16} /> Salvar</button>
        </div>
      </div>
      <div style={{ background: '#0f0f0f', padding: 16, borderRadius: 12, marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {video.description || 'Sem descrição.'}
      </div>
      <CommentSection videoId={video.id} />
    </div>
  );
}
