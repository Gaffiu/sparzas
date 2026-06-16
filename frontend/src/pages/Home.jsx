import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  const fetchVideos = () => {
    setLoading(true);
    setError('');
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel('Timeout'), 10000);

    const endpoint = search ? `${API}/videos?search=${search}` : `${API}/videos`;
    axios.get(endpoint, { cancelToken: source.token })
      .then(res => setVideos(res.data))
      .catch(err => {
        if (!axios.isCancel(err)) setError('Erro ao carregar vídeos.');
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
  };

  useEffect(() => { fetchVideos(); }, [search]);

  if (loading) {
    return (
      <div className="video-grid">
        {Array(8).fill().map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton" style={{ height: 160 }} />
            <div style={{ padding: 12 }}>
              <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: 60, color: '#aaa' }}>
        <h2>{error}</h2>
        <button onClick={fetchVideos} className="btn btn-primary" style={{ marginTop: 16 }}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      {search && <h2 style={{ marginBottom: 16 }}>Resultados para "{search}"</h2>}
      {videos.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>Nenhum vídeo encontrado.</p>
      ) : (
        <div className="video-grid">
          {videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
        </div>
      )}
    </div>
  );
}
