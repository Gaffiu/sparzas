import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    setError('');
    try {
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (event) => setProgress(Math.round((event.loaded / event.total) * 100))
        });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      const thumbnail = 'https://via.placeholder.com/320x180/00c853/000?text=SPARZAS';
      const res = await axios.post(`${API}/videos`, {
        user_id: user.id,
        title,
        description,
        video_url: publicUrl,
        thumbnail_url: thumbnail
      });
      navigate(`/watch/${res.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fadeIn" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>📤 Enviar vídeo</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="form-group">
          <input type="text" placeholder="Título do vídeo" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <textarea rows="4" placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} required />
        {uploading && (
          <div style={{ background: '#333', borderRadius: 10, height: 20, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)' }} />
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? 'Enviando...' : 'Publicar'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}
