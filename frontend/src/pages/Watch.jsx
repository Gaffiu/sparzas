import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [miniPlayer, setMiniPlayer] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/videos/${id}`).then(res => setVideo(res.data)).catch(() => {});
    axios.get(`${API}/videos/${id}/likes/count`).then(res => setLikeCount(res.data.count));
  }, [id]);

  // Mini-player ao scrollar
  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current) return;
      const rect = videoRef.current.getBoundingClientRect();
      setMiniPlayer(rect.bottom < 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestos de volume (apenas lado direito)
  const touchStartY = useRef(0);
  const initialVolume = useRef(1);

  const handleVideoTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    if (videoRef.current) {
      initialVolume.current = videoRef.current.volume;
    }
  }, []);

  const handleVideoTouchMove = useCallback((e) => {
    if (!videoRef.current) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY.current - touchY;
    const rect = videoRef.current.getBoundingClientRect();
    const height = rect.height;
    if (height === 0) return;

    // Apenas lado direito da tela ajusta volume
    if (e.touches[0].clientX > rect.left + rect.width / 2) {
      const newVolume = Math.min(1, Math.max(0, initialVolume.current + diff / height));
      videoRef.current.volume = newVolume;
    }
  }, []);

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

  const handleShare = () => {
    playClick();
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  const requestPiP = () => {
    if (videoRef.current?.webkitSetPresentationMode) {
      videoRef.current.webkitSetPresentationMode('picture-in-picture');
    } else if (videoRef.current?.requestPictureInPicture) {
      videoRef.current.requestPictureInPicture().catch(() => {});
    }
  };

  // Salvar histórico
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

  if (!video) return <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>Carregando vídeo...</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{
        borderRadius: 18, overflow: 'hidden', background: '#000', marginBottom: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)', position: 'relative',
      }}>
        <video
          ref={videoRef}
          controls
          src={video.video_url}
          style={{ width: '100%', display: 'block' }}
          poster={video.thumbnail_url || undefined}
          onTouchStart={handleVideoTouchStart}
          onTouchMove={handleVideoTouchMove}
        />
        <button onClick={requestPiP} style={{
          position:'absolute', top:16, right:16, background:'rgba(0,0,0,0.6)', color:'#fff',
          border:'none', borderRadius:8, padding:'4px 10px', fontSize:'0.9rem', cursor:'pointer',
        }}>PiP</button>
      </div>

      {/* Mini-player fixo */}
      {miniPlayer && (
        <div style={{
          position: 'fixed', bottom: 70, right: 10, width: 180, height: 100,
          background: '#000', borderRadius: 12, overflow: 'hidden', zIndex: 300,
          boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
        }}>
          <video
            src={video.video_url}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            autoPlay
            muted
            loop
          />
        </div>
      )}

      <h1 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:16 }}>{video.title}</h1>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link to={`/channel/${video.user_id}`} style={{ display:'flex', alignItems:'center', gap:14, textDecoration:'none', color:'inherit' }}>
            <div style={{ width:44, height:44, borderRadius:'50%', background:'#252525' }} />
            <div>
              <strong>{video.profiles?.username || 'SPARZAS'}</strong>
              <p style={{ fontSize:'0.8rem', color:'#888', margin:0 }}>{video.views || 0} visualizações</p>
            </div>
          </Link>
          {user && user.id !== video.user_id && <SubscribeButton channelId={video.user_id} />}
        </div>
        <div style={{ display:'flex', gap:10, position:'relative' }}>
          <button onClick={toggleLike} style={{
            background: liked ? '#00e676' : 'transparent', border: liked ? 'none' : '1px solid #333',
            color: liked ? '#000' : '#fff', padding:'8px 20px', borderRadius:24, fontWeight:600,
            fontSize:'0.9rem', cursor:'pointer', transition:'0.2s', display:'flex', alignItems:'center', gap:6,
          }}>
            <IconLike size={16} color={liked ? '#000' : '#fff'} filled={liked} />
            {likeCount} {liked ? 'Curtido' : 'Curtir'}
          </button>
          <button onClick={handleShare} style={{
            background:'transparent', border:'1px solid #333', color:'#fff', padding:'8px 20px',
            borderRadius:24, fontWeight:500, fontSize:'0.9rem', cursor:'pointer', display:'flex', alignItems:'center', gap:6,
          }}>
            <IconShare size={16} /> Compartilhar
          </button>
          {particles.map(p => (
            <span key={p.id} style={{
              position:'absolute', left:'calc(50% + 30px)', top:'50%',
              width:6, height:6, borderRadius:'50%', background:'#00e676',
              animation:'particleBurst 0.6s ease-out forwards',
              '--angle': `${p.angle}deg`, '--dist': `${p.dist}px`,
            }} />
          ))}
        </div>
      </div>
      <div style={{ background:'#0f0f0f', padding:20, borderRadius:16, marginBottom:32, whiteSpace:'pre-wrap', lineHeight:1.6 }}>
        {video.description || 'Sem descrição.'}
      </div>
      <CommentSection videoId={video.id} />
    </div>
  );
}
