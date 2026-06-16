import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';
import { IconLike, IconShare } from '../components/Icons';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const { user } = useAuth();
  const { playLike, playClick } = useSound();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [particles, setParticles] = useState([]);
  const videoRef = useRef(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    axios.get(`${API}/videos/${id}`).then(res => setVideo(res.data)).catch(() => {});
    axios.get(`${API}/videos/${id}/likes/count`).then(res => setLikeCount(res.data.count));
  }, [id]);

  // Bloquear rotação (mobile)
  useEffect(() => {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
      return () => { screen.orientation.unlock(); };
    }
  }, []);

  // Gestos no player
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50 && videoRef.current) {
      if (diff > 0) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
      } else {
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration,
          videoRef.current.currentTime + 10
        );
      }
      if (navigator.vibrate) navigator.vibrate(15);
    }
  };

  // Picture-in-Picture
  const requestPiP = () => {
    if (videoRef.current?.webkitSetPresentationMode) {
      videoRef.current.webkitSetPresentationMode('picture-in-picture');
    } else if (videoRef.current?.requestPictureInPicture) {
      videoRef.current.requestPictureInPicture().catch(() => {});
    }
  };

  // Curtir
  const toggleLike = () => {
    if (!user) return;
    playLike();
    if (navigator.vibrate) navigator.vibrate(15);
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: Math.random(),
      angle: (i / 14) * 360,
      dist: 40 + Math.random() * 40,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
    axios.post(`${API}/videos/${id}/like`, { user_id: user.id }).catch(() => {});
  };

  // Compartilhar
  const handleShare = () => {
    playClick();
    if (navigator.share) {
      navigator.share({
        title: video?.title || 'Vídeo no SPARZAS',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  // Salvar no histórico
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
      <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>
        Carregando vídeo...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Player */}
      <div style={{
        borderRadius: 18, overflow: 'hidden', background: '#000',
        marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', position: 'relative',
      }}>
        <video
          ref={videoRef}
          controls
          src={video.video_url}
          style={{ width: '100%', display: 'block' }}
          poster={video.thumbnail_url || undefined}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
        <button
          onClick={requestPiP}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '4px 10px', fontSize: '0.9rem', cursor: 'pointer',
          }}
        >
          PiP
        </button>
      </div>

      {/* Título */}
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
        {video.title}
      </h1>

      {/* Canal e ações */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16, marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link
            to={`/channel/${video.user_id}`}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              textDecoration: 'none', color: 'inherit',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#252525',
            }} />
            <div>
              <strong style={{ fontSize: '1rem' }}>
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

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
          <button
            onClick={toggleLike}
            style={{
              background: liked ? '#00e676' : 'transparent',
              border: liked ? 'none' : '1px solid #333',
              color: liked ? '#000' : '#fff',
              padding: '8px 20px', borderRadius: 24, fontWeight: 600,
              fontSize: '0.9rem', cursor: 'pointer', transition: '0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <IconLike size={16} color={liked ? '#000' : '#fff'} filled={liked} />
            {likeCount} {liked ? 'Curtido' : 'Curtir'}
          </button>
          <button
            onClick={handleShare}
            style={{
              background: 'transparent', border: '1px solid #333', color: '#fff',
              padding: '8px 20px', borderRadius: 24, fontWeight: 500,
              fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <IconShare size={16} /> Compartilhar
          </button>

          {/* Partículas de like */}
          {particles.map(p => (
            <span
              key={p.id}
              style={{
                position: 'absolute', left: 'calc(50% + 30px)', top: '50%',
                width: 6, height: 6, borderRadius: '50%', background: '#00e676',
                animation: 'particleBurst 0.6s ease-out forwards',
                '--angle': `${p.angle}deg`,
                '--dist': `${p.dist}px`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Descrição */}
      <div style={{
        background: '#0f0f0f', padding: 20, borderRadius: 16,
        marginBottom: 32, whiteSpace: 'pre-wrap', lineHeight: 1.6,
      }}>
        {video.description || 'Sem descrição.'}
      </div>

      {/* Comentários */}
      <CommentSection videoId={video.id} />
    </div>
  );
}
