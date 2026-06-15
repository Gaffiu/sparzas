import { Link } from 'react-router-dom';

export default function VideoCard({ video }) {
  return (
    <div className="video-card fadeIn">
      <Link to={`/watch/${video.id}`}>
        <img src={video.thumbnail_url || 'https://via.placeholder.com/320x180/00c853/000?text=SPARZAS'} alt={video.title} />
        <div className="info">
          <h3>{video.title}</h3>
          <p>{video.profiles?.username || 'SPARZAS'} • {video.views || 0} visualizações</p>
        </div>
      </Link>
    </div>
  );
}
