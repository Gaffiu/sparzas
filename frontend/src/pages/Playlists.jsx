import { useState } from 'react';
import VideoCard from '../components/VideoCard';

export default function Playlists() {
  const [playlists, setPlaylists] = useState(JSON.parse(localStorage.getItem('sparzas_playlists') || '[]'));

  return (
    <div>
      <h2>Playlists</h2>
      {playlists.length === 0 ? (
        <p>Nenhuma playlist criada.</p>
      ) : (
        playlists.map((pl, i) => (
          <div key={i} className="playlist-card">
            <h3>{pl.name}</h3>
            <p>{pl.videos.length} vídeos</p>
          </div>
        ))
      )}
    </div>
  );
}
