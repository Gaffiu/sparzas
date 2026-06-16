import { useState } from 'react';
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
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { playUpload, playClick } = useSound();

  if (!user) { navigate('/login'); return null; }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setUploading(true);
    playUpload();
    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    try {
      const { error } = await supabase.storage.from('videos').upload(fileName, file, { upsert: false });
      if (error) throw error;
      // simula progresso
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
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
      setTimeout(() => navigate(`/watch/${res.data.id}`), 300);
    } catch (err) {
      alert(err.message || 'Erro no upload');
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth:640, margin:'0 auto' }}>
      <h1 style={{ marginBottom:28, fontSize:'1.8rem' }}>Publicar video</h1>
      <form onSubmit={handleUpload} style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <input style={inputStyle} placeholder="Titulo do video" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea style={inputStyle} rows={4} placeholder="Descricao (opcional)" value={desc} onChange={e => setDesc(e.target.value)} />
        <div style={{ border:'2px dashed #2a2a2a', borderRadius:16, padding:40, textAlign:'center', background:'#0f0f0f', cursor:'pointer' }} onClick={() => document.getElementById('fileInput').click()}>
          <input id="fileInput" type="file" accept="video/*" style={{ display:'none' }} onChange={e => setFile(e.target.files[0])} required />
          {file ? <p style={{ color:'#00e676', margin:0 }}>{file.name} ({(file.size/(1024*1024)).toFixed(1)} MB)</p> : <p style={{ margin:0, color:'#aaa' }}>Toque para selecionar um video</p>}
        </div>
        {uploading && (
          <div style={{ background:'#1a1a1a', borderRadius:10, height:6, overflow:'hidden' }}>
            <div style={{ width:`${progress}%`, height:'100%', background:'#00e676', transition:'width 0.3s' }} />
          </div>
        )}
        <button type="submit" disabled={uploading || !file} onClick={playClick} style={{
          background:'#00e676', color:'#000', border:'none', padding:'14px 32px', borderRadius:28,
          fontWeight:700, fontSize:'1rem', cursor:'pointer', alignSelf:'flex-start', letterSpacing:0.5,
        }}>
          {uploading ? 'Enviando...' : 'Publicar video'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width:'100%', padding:14, background:'#121212', border:'1px solid #2a2a2a',
  borderRadius:12, color:'#fff', fontSize:'1rem', outline:'none',
};
