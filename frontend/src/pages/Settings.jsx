import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setUsername(data.username || '');
          if (data.avatar_url) setAvatarPreview(data.avatar_url);
        }
      });
  }, [user, navigate]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    setMessage('');
    let avatar_url = avatarPreview || '';
    if (avatarFile) {
      const fileName = `avatars/${user.id}/${Date.now()}_${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrl;
      }
    }
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.trim(), avatar_url })
      .eq('id', user.id);
    if (error) {
      setMessage('Erro ao salvar.');
    } else {
      setMessage('Configurações salvas!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Configurações do Canal</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', background: '#1a1a1a' }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#888' }}>
                {username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#aaa' }}>Nome de exibição</label>
          <input
            style={{ width: '100%', padding: '12px 16px', background: '#121212', border: '1px solid #2a2a2a', borderRadius: 12, color: '#fff', fontSize: '1rem', outline: 'none' }}
            type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Seu nome" required
          />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#00e676', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 28, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', alignSelf: 'flex-start' }}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        {message && <p style={{ color: '#00e676' }}>{message}</p>}
      </form>
    </div>
  );
}
