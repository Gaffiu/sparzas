import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

const API = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const { user } = useAuth();
  const { playLike, playClick } = useSound();
  const [liked, setLiked] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/videos/${id}`).then(res => setVideo(res.data)).catch(() => {});
  }, [id]);

  const toggleLike = () => {
    if (!user) return;
    playLike();
    setLiked(prev => !prev);
    const newParticles = Array.from({ length: 14 }, (_, i) => ({
      id: Math.random(),
      angle: (i / 14) * 360,
      dist: 40 + Math.random() * 40,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  if (!video) return <div style={{ textAlign:'center', padding:60, color:'#aaa' }}>Carregando video...</div>;

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      {/* Player */}
      <div style={{ borderRadius:18, overflow:'hidden', background:'#000', marginBottom:24, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
        <video controls src={video.video_url} style={{ width:'100%', display:'block' }} poster={video.thumbnail_url || undefined} />
      </div>

      {/* Titulo e acoes */}
      <h1 style={{ fontSize:'1.8rem', fontWeight:700, marginBottom:16, lineHeight:1.3 }}>{video.title}</h1>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:'#252525' }} />
          <div>
            <strong style={{ fontSize:'1rem' }}>{video.profiles?.username || 'SPARZAS'}</strong>
            <p style={{ fontSize:'0.8rem', color:'#888', margin:0 }}>{video.views || 0} visualizacoes</p>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, position:'relative' }}>
          <button onClick={toggleLike} style={{
            background: liked ? '#00e676' : 'transparent',
            border: liked ? 'none' : '1px solid #333',
            color: liked ? '#000' : '#fff',
            padding:'8px 20px', borderRadius:24, fontWeight:600, fontSize:'0.9rem',
            cursor:'pointer', transition:'0.2s', display:'flex', alignItems:'center', gap:6,
          }}>
            <span style={{ fontSize:'1.2rem' }}>{liked ? '✓' : ''}</span> {liked ? 'Curtido' : 'Curtir'}
          </button>
          <button onClick={playClick} style={{
            background:'transparent', border:'1px solid #333', color:'#fff',
            padding:'8px 20px', borderRadius:24, fontWeight:500, fontSize:'0.9rem', cursor:'pointer',
          }}>Compartilhar</button>
          {/* Particulas */}
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

      {/* Descricao */}
      <div style={{ background:'#0f0f0f', padding:20, borderRadius:16, marginBottom:32, whiteSpace:'pre-wrap', lineHeight:1.6 }}>
        {video.description || 'Sem descricao.'}
      </div>

      {/* Comentarios placeholder */}
      <h3 style={{ marginBottom:16 }}>Comentarios</h3>
      <p style={{ color:'#888' }}>Em breve...</p>
    </div>
  );
}
