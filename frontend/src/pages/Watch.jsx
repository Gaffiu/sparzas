import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import LikeButton from '../components/LikeButton';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="fade-in" style={{textAlign:'center', padding:40}}>Carregando...</div>;
  if (!video) return <div className="fade-in"><h2>Vídeo não encontrado</h2></div>;

  return (
    <div className="watch-container fade-in">
      <div className="video-player-wrapper">
        <video className="video-player" controls autoPlay src={video.video_url} poster={video.thumbnail_url || undefined} />
      </div>
      <h1 className="watch-title">{video.title}</h1>
      <div className="watch-actions">
        <div className="channel-bar">
          <img src={video.profiles?.avatar_url || 'https://via.placeholder.com/44'} alt="" />
          <div>
            <strong>{video.profiles?.username || 'Usuário'}</strong>
            <p style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>{video.views} visualizações</p>
          </div>
          {user && video.user_id !== user.id && <SubscribeButton channelId={video.user_id} />}
        </div>
        <div className="action-buttons">
          <LikeButton videoId={video.id} initialLiked={false} />
          <button className="btn btn-outline">🔗 Compartilhar</button>
        </div>
      </div>
      <div style={{ background: 'var(--bg-primary)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
        <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)' }}>{video.description || 'Sem descrição'}</p>
        <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Publicado em {new Date(video.created_at).toLocaleDateString('pt-BR')}</p>
      </div>
      <CommentSection videoId={video.id} />
    </div>
  );
}
