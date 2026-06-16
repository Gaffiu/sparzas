import { useState, useEffect } from 'react';
import VideoCard from '../components/VideoCard';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('sparzas_history') || '[]');
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('sparzas_history');
    setHistory([]);
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>Histórico de vídeos</h2>
        {history.length > 0 && (
          <button onClick={clearHistory} style={{
            background:'transparent', border:'1px solid #333', color:'#fff',
            padding:'6px 16px', borderRadius:20, fontSize:'0.85rem', cursor:'pointer',
          }}>
            Limpar histórico
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div style={{ textAlign:'center', marginTop:80, color:'#888' }}>
          <p>Nenhum vídeo assistido ainda.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:24 }}>
          {history.map((v, i) => (
            <VideoCard key={v.id} video={v} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
