import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function PlaylistModal({ videoId, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const createAndAdd = async () => {
    if (!name.trim()) return;
    try {
      const res = await axios.post(`${API}/users/${user.id}/playlists`, { name: name.trim() });
      await axios.post(`${API}/users/playlists/${res.data.id}/videos`, { video_id: videoId });
      setMessage('Playlist criada e vídeo adicionado!');
      setTimeout(onClose, 1500);
    } catch (err) {
      setMessage('Erro ao criar playlist.');
    }
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, margin: 'auto', borderRadius: 20 }}>
        <h3>Nova playlist</h3>
        <input className="search-input" placeholder="Nome da playlist" value={name} onChange={e => setName(e.target.value)} style={{ margin: '16px 0' }} />
        <button onClick={createAndAdd} className="btn btn-primary" style={{ width: '100%' }}>Criar e adicionar</button>
        {message && <p style={{ color: '#00e676', marginTop: 12 }}>{message}</p>}
        <button onClick={onClose} className="sheet-cancel">Cancelar</button>
      </div>
    </div>
  );
}
