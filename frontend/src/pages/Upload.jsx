import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';
import { useSound } from '../hooks/useSound';

const API = import.meta.env.VITE_API_URL;

export default function Upload() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const { playUpload, playClick } = useSound();
  const fileInputRef = useRef(null);

  if (!user) { navigate('/login'); return null; }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith('video/')) {
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    playUpload();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage.from('videos').upload(fileName, file, { upsert: false });
      if (error) throw error;
      // Simular progresso
      let prog = 0;
      const interval = setInterval(() => {
        prog += 8;
        if (prog >= 95) clearInterval(interval);
        setProgress(prog);
      }, 200);
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      clearInterval(interval);
      setProgress(100);
      const res = await axios.post(`${API}/videos`, {
        user_id: user.id, title: title.trim(), description: desc.trim(),
        video_url: publicUrl, thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'
      });
      setTimeout(() => navigate(`/watch/${res.data.id}`), 400);
    } catch (err) {
      alert(err.message || 'Erro no upload');
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 28 }}>Publicar vídeo</h1>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Área de upload drag-and-drop / clique */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? '#00e676' : '#2a2a2a'}`,
            borderRadius: 16,
            padding: 40,
            textAlign: 'center',
            background: dragOver ? 'rgba(0,230,118,0.05)' : '#0f0f0f',
            cursor: 'pointer',
            transition: '0.2s',
            position: 'relative',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFileChange}
            required
            style={{ display: 'none' }}
          />
          {previewUrl ? (
            <div>
              <video src={previewUrl} style={{ width: '100%', maxHeight: 200, borderRadius: 12, marginBottom: 12 }} controls />
              <p style={{ color: '#00e676', margin: 0 }}>{file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)</p>
              <button type="button" onClick={() => { setFile(null); setPreviewUrl(null); }} style={{
                background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 16px', borderRadius: 20,
                marginTop: 12, cursor: 'pointer', fontSize: '0.85rem',
              }}>Remover</button>
            </div>
          ) : (
            <div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ color: '#888', margin: 0 }}>Toque para selecionar um vídeo da galeria</p>
              <p style={{ color: '#666', fontSize: '0.8rem', marginTop: 4 }}>ou arraste o arquivo para cá</p>
            </div>
          )}
        </div>

        {/* Campos de título e descrição */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            style={inputStyle}
            placeholder="Título do vídeo (obrigatório)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
            placeholder="Descrição (opcional)"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={4}
          />
        </div>

        {/* Barra de progresso */}
        {uploading && (
          <div style={{ background: '#1a1a1a', borderRadius: 8, height: 6, overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: 'linear-gradient(90deg, #00e676, #1de9b6)',
              transition: 'width 0.3s',
              boxShadow: '0 0 8px rgba(0,230,118,0.5)',
            }} />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          onClick={playClick}
          style={{
            background: '#00e676', color: '#000', border: 'none', padding: '14px 32px',
            borderRadius: 28, fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            alignSelf: 'flex-start', letterSpacing: 0.5, transition: '0.2s',
            opacity: uploading || !file ? 0.6 : 1,
          }}
        >
          {uploading ? 'Enviando...' : 'Publicar vídeo'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px 18px', background: '#121212',
  border: '1px solid #2a2a2a', borderRadius: 12, color: '#fff',
  fontSize: '1rem', outline: 'none', fontFamily: 'Inter, sans-serif',
};
