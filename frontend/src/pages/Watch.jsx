import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

export default function Watch() {
  const { id } = useParams(); // pega o ID da URL
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/videos/${id}`)
      .then(res => {
        setVideo(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Vídeo não encontrado.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Carregando...</div>;
  }

  if (error || !video) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>{error || 'Vídeo não encontrado'}</h2>
        <Link to="/">Voltar à Home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      {/* Player de vídeo */}
      <video
        controls
        src={video.video_url}
        style={{ width: '100%', borderRadius: 10, marginBottom: 20 }}
        poster={video.thumbnail_url || undefined}
      />

      {/* Título */}
      <h1 style={{ fontSize: 24, marginBottom: 10 }}>{video.title}</h1>

      {/* Informações do canal */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <img
          src={video.profiles?.avatar_url || 'https://via.placeholder.com/40'}
          alt="Avatar"
          style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
        />
        <div>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{video.profiles?.username || 'Usuário'}</p>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
            {video.views} visualizações • {new Date(video.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 20 }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{video.description || 'Sem descrição.'}</p>
      </div>

      {/* Espaço para comentários (futuro) */}
      <div>
        <h3>Comentários</h3>
        <p style={{ color: '#999' }}>Em breve...</p>
      </div>

      <Link to="/" style={{ display: 'inline-block', marginTop: 20, color: '#ff6b00' }}>
        ← Voltar para Home
      </Link>
    </div>
  );
}
