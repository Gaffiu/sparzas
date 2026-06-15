import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se há sessão ativa
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Carrega vídeos da API
    axios.get(`${API_URL}/videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🎥 SPARZAS</h1>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 10 }}>Logado: {user.email}</span>
              <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Sair</button>
            </>
          ) : (
            <a href="/login" style={{ padding: '5px 10px', backgroundColor: '#ff6b00', color: '#fff', textDecoration: 'none', borderRadius: 5 }}>Entrar</a>
          )}
        </div>
      </div>

      {videos.length === 0 ? (
        <p>Nenhum vídeo ainda. {user ? 'Envie o primeiro!' : 'Faça login para enviar.'}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {videos.map(video => (
            <div key={video.id}>
              <a href={`/watch/${video.id}`}>
                <img
                  src={video.thumbnail_url || 'https://via.placeholder.com/320x180'}
                  width="100%"
                  alt={video.title}
                />
                <p>{video.title}</p>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
