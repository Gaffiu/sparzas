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
  const { user } = useAuth();
  const { playLike, playClick } = useSound();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    axios.get(`${API}/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => {});
    axios.get(`${API}/videos/${id}/likes/count`)
      .then(res => setLikeCount(res.data.count));
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    if (navigator.vibrate) navigator.vibrate(15); // feedback tátil
    playLike();
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    axios.post(`${API}/videos/${id}/like`, { user_id: user.id }).catch(() => {});
  };

  const handleShare = () => {
    playClick();
    if (navigator.share) {
      navigator.share({
        title: video?.title || 'Vídeo no SPARZAS',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copiado!'));
    }
  };

  const saveToWatchLater = () => {
    if (!video) return;
    if (navigator.vibrate) navigator.vibrate(10); // feedback tátil
    playClick();
    const list = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    if (list.some(v => v.id === video.id)) {
      alert('Este vídeo já está na lista "Assistir mais tarde".');
      return;
    }
    list.push({
      id: video.id,
      title: video.title,
      thumbnail_url: video.thumbnail_url,
      profiles: video.profiles,
      views: video.views,
      created_at: video.created_at,
    });
    localStorage.setItem('sparzas_watch_later', JSON.stringify(list));
    alert('Vídeo salvo em "Assistir mais tarde"!');
  };

  // Salvar no histórico local
  useEffect(() => {
    if (!video) return;
    const history = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    const newEntry = {
      id: video.id,
      title: video.title,
      thumbnail_url: video.thumbnail_url,
      profiles: video.profiles,
      watchedAt: new Date().toISOString(),
    };
    const filtered = history.filter(v => v.id !== video.id);
    filtered.unshift(newEntry);
    localStorage.setItem('sparzas_history', JSON.stringify(filtered.slice(0, 50)));
  }, [video]);

  if (!video) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Player customizado */}
      <Player
        src={video.video_url}
        poster={video.thumbnail_url}
        onLike={toggleLike}
        liked={liked}
        likeCount={likeCount}
        onShare={handleShare}
        onPiP={() => {}}
        onTheater={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.body.requestFullscreen();
          }
        }}
      />

      {/* Título */}
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
        {video.title}
      </h1>

      {/* Metadados e ações */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20
      }}>
        {/* Info do canal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to={`/channel/${video.user_id}`} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', color: 'inherit',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: '#252525',
            }} />
            <div>
              <strong style={{ fontSize: '0.95rem' }}>
                {video.profiles?.username || 'SPARZAS'}
              </strong>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
                {video.views || 0} visualizações
              </p>
            </div>
          </Link>
          {user && user.id !== video.user_id && (
            <SubscribeButton channelId={video.user_id} />
          )}
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={saveToWatchLater} className="btn btn-outline">
            + Salvar
          </button>
        </div>
      </div>

      {/* Descrição */}
      <div style={{
        background: '#0f0f0f',
        padding: 16,
        borderRadius: 12,
        marginBottom: 28,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5,
        fontSize: '0.95rem',
      }}>
        {video.description || 'Sem descrição.'}
      </div>

      {/* Comentários */}
      <CommentSection videoId={video.id} />
    </div>
  );
}
