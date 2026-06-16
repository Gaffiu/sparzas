import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  return (
    <Link to={`/watch/${video.id}`} className="video-card fade-in-up">
      <div className="thumbnail-wrapper">
        <img src={video.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'} alt={video.title} loading="lazy" />
        <span className="video-duration">12:34</span> {/* Idealmente viria do banco */}
      </div>
      <div className="video-info">
        <img className="channel-avatar" src={video.profiles?.avatar_url || 'https://via.placeholder.com/36'} alt="" />
        <div className="video-meta">
          <h3>{video.title}</h3>
          <p>{video.profiles?.username || 'SPARZAS'}</p>
          <p>{video.views || 0} visualizações • {new Date(video.created_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </Link>
  );
}
