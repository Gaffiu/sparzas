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
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { playUpload } = useSound();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  if (!user) { navigate('/login'); return null; }

  const requestMediaPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionGranted(true);
      fileInputRef.current?.click();
    } catch (err) {
      // Permissão negada, mas ainda permite selecionar arquivo
      setPermissionGranted(false);
      fileInputRef.current?.click();
    }
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('video/')) {
        addToast('Selecione um arquivo de vídeo válido.', 'error');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    playUpload();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage.from('videos').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        if (prog >= 90) clearInterval(interval);
        setProgress(prog);
      }, 200);
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName);
      clearInterval(interval);
      setProgress(100);
      await axios.post(`${API}/videos`, {
        user_id: user.id,
        title: title.trim(),
        description: desc.trim(),
        video_url: publicUrl,
        thumbnail_url: 'https://via.placeholder.com/640x360/00e676/050505?text=SPARZAS'
      });
      addToast('Vídeo publicado!', 'success');
      navigate('/');
    } catch (err) {
      addToast('Erro: ' + (err.message || 'Falha no upload'), 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 20 }}>Publicar vídeo</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          onClick={requestMediaPermission}
          style={{
            border: '2px dashed #333', borderRadius: 12, padding: 30,
            textAlign: 'center', background: '#0f0f0f', cursor: 'pointer',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          {file ? (
            <p style={{ color: '#00e676' }}>{file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)</p>
          ) : (
            <p style={{ color: '#aaa' }}>Toque para selecionar um vídeo (câmera ou galeria)</p>
          )}
          {!permissionGranted && file === null && (
            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: 8 }}>
              Permitir acesso à câmera para gravar diretamente
            </p>
          )}
        </div>
        <input
          className="search-input"
          placeholder="Título do vídeo"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="search-input"
          placeholder="Descrição"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          rows={3}
          style={{ resize: 'vertical' }}
        />
        {uploading && (
          <div style={{ background: '#1a1a1a', borderRadius: 6, height: 6, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#00e676', transition: 'width 0.3s' }} />
          </div>
        )}
        <button
          type="submit"
          disabled={uploading || !file}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          {uploading ? 'Enviando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
}
