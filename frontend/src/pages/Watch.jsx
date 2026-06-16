import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import Player from '../components/Player';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';
import PlaylistModal from '../components/PlaylistModal';
import PipButton from '../components/PipButton';
import Autoplay from '../components/Autoplay';
import { IconLike, IconDislike, IconShare, IconPlaylistAdd } from '../components/Icons';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playLike } = useSound();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [queue, setQueue] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    axios.get(`${API}/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Vídeo não encontrado.');
        setLoading(false);
      });
    axios.get(`${API}/videos/${id}/likes/count`)
      .then(res => setLikeCount(res.data.count));
    axios.get(`${API}/videos`)
      .then(res => setQueue(res.data.filter(v => v.id !== id).slice(0, 5)));
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
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  const saveToWatchLater = () => {
    if (!video) return;
    const list = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    if (!list.some(v => v.id === video.id)) {
      list.push({ id: video.id, title: video.title, thumbnail_url: video.thumbnail_url, profiles: video.profiles });
      localStorage.setItem('sparzas_watch_later', JSON.stringify(list));
      alert('Salvo em Assistir mais tarde!');
    }
  };

  // Histórico
  useEffect(() => {
    if (!video) return;
    const history = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    const newEntry = {
      id: video.id, title: video.title, thumbnail_url: video.thumbnail_url,
      profiles: video.profiles, watchedAt: new Date().toISOString()
    };
    const filtered = history.filter(v => v.id !== video.id);
    filtered.unshift(newEntry);
    localStorage.setItem('sparzas_history', JSON.stringify(filtered.slice(0, 50)));
  }, [video]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (error) return <div style={{ textAlign:'center', padding:60, color:'#aaa' }}><h2>{error}</h2><Link to="/">Voltar</Link></div>;
  if (!video) return <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>Vídeo não encontrado.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="player-container">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.thumbnail_url}
          className="player-video"
          controls
          playsInline
        />
        <div className="player-controls">
          <PipButton videoRef={videoRef} />
        </div>
      </div>
      <Autoplay videoRef={videoRef} queue={queue} />

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
          <button onClick={() => setShowPlaylistModal(true)} className="btn-action"><IconPlaylistAdd size={16} /> Salvar</button>
          <button onClick={saveToWatchLater} className="btn-action">⌚ + Tarde</button>
        </div>
      </div>
      <div style={{ background: '#0f0f0f', padding: 16, borderRadius: 12, marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {video.description || 'Sem descrição.'}
      </div>
      <CommentSection videoId={video.id} />
      {showPlaylistModal && <PlaylistModal videoId={video.id} onClose={() => setShowPlaylistModal(false)} />}

      {/* Fila de próximos vídeos */}
      {queue.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Próximos vídeos</h3>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
            {queue.map(v => (
              <Link key={v.id} to={`/watch/${v.id}`} style={{ minWidth: 200, background: '#0f0f0f', borderRadius: 12, padding: 8, textDecoration: 'none', color: 'inherit' }}>
                <img src={v.thumbnail_url || 'https://via.placeholder.com/160x90'} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }} />
                <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>{v.title}</p>
                <span style={{ fontSize: '0.75rem', color: '#888' }}>{v.profiles?.username}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
