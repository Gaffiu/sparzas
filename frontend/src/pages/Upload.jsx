import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('videos').upload(fileName, file);
    if (error) { alert(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
    const res = await axios.post(`${API}/videos`, {
      user_id: user.id,
      title,
      video_url: publicUrl,
      thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'
    });
    navigate(`/watch/${res.data.id}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Enviar vídeo</h1>
      <form onSubmit={handleUpload}>
        <input style={inputStyle} placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} style={{ margin: '20px 0' }} required />
        <button type="submit" disabled={uploading} style={{ background: '#00e676', color: '#000', border:'none', padding:'12px 28px', borderRadius:24, fontWeight:600 }}>
          {uploading ? 'Enviando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 14,
  background: '#121212',
  border: '1px solid #2a2a2a',
  borderRadius: 10,
  color: '#fff',
  fontSize: '1rem',
  marginTop: 20,
};
