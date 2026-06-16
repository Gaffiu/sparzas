import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';
import { useToast } from '../contexts/ToastContext';

const API = import.meta.env.VITE_API_URL;

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { playClick } = useSound();
  const { addToast } = useToast();

  useEffect(() => {
    axios.get(`${API}/videos/${videoId}/comments`).then(res => setComments(res.data)).catch(() => {});
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    playClick();
    try {
      const res = await axios.post(`${API}/videos/${videoId}/comments`, { user_id: user.id, content: newComment.trim() });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
      addToast('Comentário enviado!', 'success');
    } catch (err) {
      addToast('Erro ao comentar.', 'error');
    }
  };

  const toggleLikeComment = (commentId) => {
    // Simulação de like no comentário (local)
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, liked: !c.liked } : c));
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Comentários ({comments.length})</h3>
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input className="search-input" placeholder="Adicionar comentário..." value={newComment} onChange={e => setNewComment(e.target.value)} style={{ flex: 1, borderRadius: 20 }} />
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      )}
      {comments.map(c => (
        <div key={c.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#252525', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '0.9rem' }}>{c.profiles?.username || 'Usuário'}</strong>
            <p style={{ margin: '2px 0 4px', fontSize: '0.9rem' }}>{c.content}</p>
            <button onClick={() => toggleLikeComment(c.id)} style={{ background: 'none', border: 'none', color: c.liked ? '#00e676' : '#888', cursor: 'pointer', fontSize: '0.8rem' }}>
              {c.liked ? '👍' : '👍🏾'} {c.likes || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
