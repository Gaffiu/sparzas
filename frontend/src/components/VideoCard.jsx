import { Link } from 'react-router-dom';
import { useSound } from '../hooks/useSound';

export default function VideoCard({ video, index = 0 }) {
  const { playClick } = useSound();
  const animStyle = {
    animation: `fadeInUp 0.5s ease ${index * 0.06}s both`,
    background: '#0f0f0f', borderRadius: 16, overflow: 'hidden', textDecoration: 'none', color: '#fff',
    display: 'block', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  return (
    <Link to={`/watch/${video.id}`} onClick={playClick}
      style={animStyle}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,230,118,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position:'relative', paddingTop:'56.25%', background:'#111' }}>
        <img src={video.thumbnail_url || 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
      </div>
      <div style={{ padding:16, display:'flex', gap:14 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'#202020' }} />
        <div style={{ flex:1 }}>
          <h3 style={{ fontSize:'0.95rem', fontWeight:600, margin:'0 0 4px', lineHeight:1.3 }}>{video.title}</h3>
          <p style={{ fontSize:'0.8rem', color:'#aaa', margin:0 }}>{video.profiles?.username || 'SPARZAS'}</p>
          <p style={{ fontSize:'0.8rem', color:'#888', margin:0 }}>{video.views || 0} visualizações</p>
        </div>
      </div>
    </Link>
  );
}
