import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Player from '../components/Player';
import SubscribeButton from '../components/SubscribeButton';
import CommentSection from '../components/CommentSection';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    axios.get(`${API}/videos/${id}`).then(res => setVideo(res.data)).catch(() => {});
    axios.get(`${API}/videos/${id}/likes/count`).then(res => setLikeCount(res.data.count));
    // Buscar fila de reprodução (simulada)
    axios.get(`${API}/videos`).then(res => setQueue(res.data.filter(v => v.id !== id).slice(0, 5)));
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    setLiked(prev => !prev);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    axios.post(`${API}/videos/${id}/like`, { user_id: user.id }).catch(() => {});
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: video?.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado!'));
    }
  };

  const saveToWatchLater = () => {
    const list = JSON.parse(localStorage.getItem('sparzas_watch_later') || '[]');
    if (!list.some(v => v.id === video.id)) {
      list.push(video);
      localStorage.setItem('sparzas_watch_later', JSON.stringify(list));
      alert('Salvo em Assistir mais tarde!');
    }
  };

  if (!video) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="watch-container">
      <Player
        src={video.video_url}
        poster={video.thumbnail_url}
        onLike={toggleLike}
        liked={liked}
        likeCount={likeCount}
        onShare={handleShare}
        onPiP={() => {}}
        onTheater={() => document.fullscreenElement ? document.exitFullscreen() : document.body.requestFullscreen()}
      />
      <h1>{video.title}</h1>
      <div className="watch-meta">
        <div className="channel-info">
          <SubscribeButton channelId={video.user_id} />
        </div>
        <button onClick={saveToWatchLater} className="btn-outline">+ Salvar</button>
      </div>
      <div className="description">{video.description || 'Sem descrição.'}</div>
      <CommentSection videoId={video.id} />
      {queue.length > 0 && (
        <div className="queue">
          <h3>Próximos vídeos</h3>
          {queue.map(v => (
            <div key={v.id} className="queue-item">
              <img src={v.thumbnail_url} alt="" />
              <div>
                <p>{v.title}</p>
                <span>{v.profiles?.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
