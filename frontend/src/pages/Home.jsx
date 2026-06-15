import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica sessão ativa
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Carrega vídeos
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
      {/* Cabeçalho com título e botões */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>🎥 SPARZAS</h1>
        <div>
          {user ? (
            <>
              <Link to="/upload" style={{
                marginRight: 10,
                padding: '8px 12px',
                backgroundColor: '#28a745',
                color: '#fff',
                borderRadius: 5,
                textDecoration: 'none',
                fontSize: 14
              }}>
                + Enviar
              </Link>
              <span style={{ marginRight: 10, fontSize: 14 }}>{user.email}</span>
              <button onClick={handleLogout} style={{ padding: '8px 12px', fontSize: 14, cursor: 'pointer' }}>Sair</button>
            </>
          ) : (
            <Link to="/login" style={{
              padding: '8px 12px',
              backgroundColor: '#ff6b00',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 5,
              fontSize: 14
            }}>
              Entrar
            </Link>
          )}
        </div>
      </div>

      {/* Lista de vídeos */}
      {videos.length === 0 ? (
        <p>Nenhum vídeo ainda. {user ? 'Seja o primeiro a enviar!' : 'Faça login para enviar.'}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>
          {videos.map(video => (
            <div key={video.id} style={{ border: '1px solid #ddd', borderRadius: 10, overflow: 'hidden' }}>
              <Link to={`/watch/${video.id}`}>
                <img
                  src={video.thumbnail_url || 'https://via.placeholder.com/320x180'}
                  alt={video.title}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
                <div style={{ padding: 10 }}>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>{video.title}</p>
                  <p style={{ fontSize: 12, color: '#666', margin: '5px 0 0' }}>
                    {video.profiles?.username || 'Usuário'} • {video.views || 0} visualizações
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
