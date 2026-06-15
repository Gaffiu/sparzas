import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => setError('Vídeo não encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="fadeIn" style={{textAlign:'center'}}>Carregando...</div>;
  if (error || !video) return <div className="fadeIn"><h2>{error}</h2><Link to="/">Voltar</Link></div>;

  return (
    <div className="watch-container fadeIn">
      <video className="video-player" controls src={video.video_url} poster={video.thumbnail_url || undefined} />
      <h1>{video.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={video.profiles?.avatar_url || 'https://via.placeholder.com/40'} style={{width:40, height:40, borderRadius:'50%'}} alt="" />
          <div>
            <Link to={`/channel/${video.user_id}`} style={{fontWeight:'bold'}}>{video.profiles?.username || 'Usuário'}</Link>
            <p style={{fontSize:14, color:'#aaa'}}>{video.views} visualizações • {new Date(video.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <LikeButton videoId={video.id} initialLiked={false} />
          {user && video.user_id !== user.id && <SubscribeButton channelId={video.user_id} />}
        </div>
      </div>
      <div style={{ background: 'var(--surface)', padding: 15, borderRadius: 12, marginTop: 15 }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{video.description || 'Sem descrição'}</p>
      </div>
      <CommentSection videoId={video.id} />
    </div>
  );
}
