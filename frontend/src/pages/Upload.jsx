import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';
import { useSound } from '../hooks/useSound';
import { useToast } from '../contexts/ToastContext';

const API = import.meta.env.VITE_API_URL;

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { playUpload } = useSound();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  if (!user) { navigate('/login'); return null; }

  const requestMedia = async () => {
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: true }); stream.getTracks().forEach(t => t.stop()); } catch {}
    fileInputRef.current?.click();
  };

  const handleFile = (e) => { if (e.target.files[0]) setFile(e.target.files[0]); };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    playUpload();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage.from('videos').upload(fileName, file);
      if (error) throw error;
      let prog = 0;
      const interval = setInterval(() => { prog += 10; if (prog >= 90) clearInterval(interval); setProgress(prog); }, 200);
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      clearInterval(interval);
      setProgress(100);
      await axios.post(`${API}/videos`, { user_id: user.id, title: title.trim(), description: desc.trim(), video_url: publicUrl, thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS' });
      addToast('Vídeo publicado com sucesso!', 'success');
      navigate('/');
    } catch (err) {
      addToast('Erro ao enviar vídeo: ' + err.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Publicar vídeo</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div onClick={requestMedia} style={{ border: '2px dashed #333', borderRadius: 12, padding: 30, textAlign: 'center', background: '#0f0f0f', cursor: 'pointer' }}>
          <input ref={fileInputRef} type="file" accept="video/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
          {file ? <p style={{ color: '#00e676' }}>{file.name}</p> : <p style={{ color: '#aaa' }}>Toque para selecionar um vídeo</p>}
        </div>
        <input className="search-input" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea className="search-input" placeholder="Descrição" value={desc} onChange={e => setDesc(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
        {uploading && <div style={{ height: 4, background: '#333', borderRadius: 2 }}><div style={{ width: `${progress}%`, height: '100%', background: '#00e676' }} /></div>}
        <button type="submit" disabled={uploading || !file} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>{uploading ? 'Enviando...' : 'Publicar'}</button>
      </form>
    </div>
  );
}
