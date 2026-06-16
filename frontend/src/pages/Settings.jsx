import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../contexts/ToastContext';

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return navigate('/login');
    supabase.from('profiles')
      .select('username, avatar_url, bio, website, contact_email')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setUsername(data.username || '');
          setBio(data.bio || '');
          setWebsite(data.website || '');
          setContactEmail(data.contact_email || '');
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
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, { upsert: true });
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
        avatar_url = publicUrl;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: username.trim(),
        avatar_url,
        bio: bio.trim(),
        website: website.trim(),
        contact_email: contactEmail.trim()
      })
      .eq('id', user.id);

    if (error) {
      setMessage('Erro ao salvar.');
      addToast('Erro ao salvar configurações.', 'error');
    } else {
      setMessage('Configurações salvas com sucesso!');
      addToast('Configurações salvas!', 'success');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Configurações do Canal</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Avatar */}
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

        {/* Nome */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#aaa' }}>Nome de exibição</label>
          <input
            className="search-input"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Seu nome"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#aaa' }}>Bio</label>
          <textarea
            className="search-input"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Conte um pouco sobre seu canal..."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Website */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#aaa' }}>Website</label>
          <input
            className="search-input"
            type="url"
            value={website}
            onChange={e => setWebsite(e.target.value)}
            placeholder="https://seusite.com"
          />
        </div>

        {/* Email de contato */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#aaa' }}>E-mail de contato</label>
          <input
            className="search-input"
            type="email"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            placeholder="contato@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        {message && <p style={{ color: '#00e676' }}>{message}</p>}
      </form>
    </div>
  );
}
