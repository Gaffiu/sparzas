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
import { IconLike, IconDislike, IconShare, IconPlaylistAdd } from '../components/Icons';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { playLike } = useSound();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios.get(`${API}/videos/${id}`).then(res => { setVideo(res.data); setLoading(false); }).catch(() => setLoading(false));
    axios.get(`${API}/videos/${id}/likes/count`).then(res => setLikeCount(res.data.count));
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

  const handleShare = () => {
    if (navigator.share) navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    else navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
  };

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!video) return <div style={{ textAlign:'center', padding:60 }}>Vídeo não encontrado.</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="player-container">
        <video ref={videoRef} src={video.video_url} poster={video.thumbnail_url} className="player-video" controls playsInline />
        <div className="player-controls">
          <PipButton videoRef={videoRef} />
        </div>
      </div>
      <h1>{video.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to={`/channel/${video.user_id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#252525' }} />
            <div>
              <strong>{video.profiles?.username || 'SPARZAS'}</strong>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>{video.views} visualizações</p>
            </div>
          </Link>
          {user && <SubscribeButton channelId={video.user_id} />}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleLike} className={`btn-action ${liked ? 'active' : ''}`}><IconLike size={16} color={liked ? '#000' : '#fff'} filled={liked} /> {likeCount}</button>
          <button onClick={() => setDisliked(!disliked)} className={`btn-action ${disliked ? 'active' : ''}`}><IconDislike size={16} color={disliked ? '#000' : '#fff'} filled={disliked} /></button>
          <button onClick={handleShare} className="btn-action"><IconShare size={16} /> Compartilhar</button>
          <button onClick={() => setShowPlaylistModal(true)} className="btn-action"><IconPlaylistAdd size={16} /> Salvar</button>
        </div>
      </div>
      <div style={{ background: '#0f0f0f', padding: 16, borderRadius: 12, marginBottom: 24, whiteSpace: 'pre-wrap' }}>{video.description || 'Sem descrição.'}</div>
      <CommentSection videoId={video.id} />
      {showPlaylistModal && <PlaylistModal videoId={video.id} onClose={() => setShowPlaylistModal(false)} />}
    </div>
  );
}
