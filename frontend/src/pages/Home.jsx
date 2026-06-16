import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [trending, setTrending] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  const fetchVideos = () => {
    setLoading(true);
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => source.cancel('Timeout'), 10000);
    axios.get(`${API}/videos`, { cancelToken: source.token })
      .then(res => {
        const all = res.data;
        setVideos(all);
        setTrending(all.sort(() => 0.5 - Math.random()).slice(0, 10));
        setShorts(all.filter(v => v.title.length < 25).slice(0, 8));
      })
      .catch(() => {})
      .finally(() => { clearTimeout(timeout); setLoading(false); });
  };

  useEffect(() => { fetchVideos(); }, [search]);

  if (loading) return <div className="video-grid">{Array(8).fill().map((_,i) => <div key={i} className="skeleton-card"><div className="skeleton" style={{height:160}} /></div>)}</div>;

  return (
    <div>
      {search ? (
        <>
          <h2>Resultados para "{search}"</h2>
          <div className="video-grid">{videos.map(v => <VideoCard key={v.id} video={v} />)}</div>
        </>
      ) : (
        <>
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Shorts</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {shorts.map(v => (
                <div key={v.id} style={{ minWidth: 140, height: 200, background: '#111', borderRadius: 12, overflow: 'hidden' }}>
                  <video src={v.video_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                </div>
              ))}
            </div>
          </section>
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ marginBottom: 12 }}>Em alta</h2>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {trending.map(v => <VideoCard key={v.id} video={v} />)}
            </div>
          </section>
          <section>
            <h2 style={{ marginBottom: 12 }}>Recomendados</h2>
            <div className="video-grid">{videos.slice(0, 12).map(v => <VideoCard key={v.id} video={v} />)}</div>
          </section>
        </>
      )}
    </div>
  );
}
