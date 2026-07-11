import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function AdvancedSearch() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState('recent');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = () => {
    if (!query.trim()) return;
    setLoading(true);
    axios.get(`${API}/videos?search=${encodeURIComponent(query)}`)
      .then(res => {
        let data = res.data;
        if (sort === 'recent') data = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        if (sort === 'views') data = data.sort((a, b) => (b.views || 0) - (a.views || 0));
        setVideos(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResults(); }, [sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults();
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          className="search-input"
          placeholder="Buscar vídeos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary">Buscar</button>
      </form>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button onClick={() => setSort('recent')} className={`btn ${sort === 'recent' ? 'btn-primary' : 'btn-outline'}`}>Mais recentes</button>
        <button onClick={() => setSort('views')} className={`btn ${sort === 'views' ? 'btn-primary' : 'btn-outline'}`}>Mais visualizados</button>
      </div>
      {loading ? <div className="spinner" /> : (
        <div className="video-grid">
          {videos.map(v => <VideoCard key={v.id} video={v} />)}
        </div>
      )}
    </div>
  );
}
