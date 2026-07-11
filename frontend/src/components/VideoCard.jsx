import { Link } from 'react-router-dom';
import { useSound } from '../hooks/useSound';

export default function VideoCard({ video, index = 0 }) {
  const { playClick } = useSound();

  return (
    <Link
      to={`/watch/${video.id}`}
      onClick={playClick}
      className="video-card"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <div className="thumbnail-wrapper">
        <img src={video.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'} alt={video.title} loading="lazy" />
      </div>
      <div className="video-info">
        <div className="channel-avatar-small" />
        <div className="video-meta">
          <h3>{video.title}</h3>
          <p>{video.profiles?.username || 'SPARZAS'} · {video.views || 0} visualizações</p>
        </div>
      </div>
    </Link>
  );
}
