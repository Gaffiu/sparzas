import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

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
        });
      if (uploadError) throw uploadError;
      
      // Simular progresso (já que onUploadProgress pode não funcionar no mobile)
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) clearInterval(interval);
          return prev + 10;
        });
      }, 300);
      
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      clearInterval(interval);
      setProgress(100);
      
      const res = await axios.post(`${API}/videos`, {
        user_id: user.id,
        title,
        description: desc,
        video_url: publicUrl,
        thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'
      });
      navigate(`/watch/${res.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>📤 Enviar vídeo</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <input className="form-input" placeholder="Título do vídeo" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="form-input" rows="4" placeholder="Descrição (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
        <div style={{ border: '2px dashed #333', borderRadius: 16, padding: 40, textAlign: 'center', background: 'var(--bg-primary)' }}>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files[0])} required />
          {file && <p style={{ marginTop: 12, color: 'var(--green-neon)' }}>{file.name} ({(file.size / (1024*1024)).toFixed(1)} MB)</p>}
        </div>
        {uploading && (
          <div style={{ background: '#1a1a1a', borderRadius: 12, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--green-neon)', transition: 'width 0.3s' }} />
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={uploading || !file} style={{ alignSelf: 'flex-start', padding: '12px 32px' }}>
          {uploading ? '⏳ Enviando...' : '🚀 Publicar'}
        </button>
        {error && <p style={{ color: 'salmon' }}>{error}</p>}
      </form>
    </div>
  );
}
