import { Link } from 'react-router-dom';

export default function VideoCard({ video, index }) {
  return (
    <Link to={`/watch/${video.id}`} style={{
      background: '#0f0f0f',
      borderRadius: 16,
      overflow: 'hidden',
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      animation: `fadeInUp 0.4s ease ${index * 0.05}s both`,
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,230,118,0.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position: 'relative', paddingTop: '56.25%', background: '#111' }}>
        <img
          src={video.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'}
          alt={video.title}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#252525', flexShrink: 0 }} />
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0 0 4px', color: '#fff' }}>{video.title}</h3>
          <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{video.profiles?.username || 'SPARZAS'}</p>
          <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '2px 0 0' }}>{video.views || 0} visualizações</p>
        </div>
      </div>
    </Link>
  );
}
