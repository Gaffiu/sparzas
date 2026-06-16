import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

const API = import.meta.env.VITE_API_URL;

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();
  const { playClick } = useSound();

  useEffect(() => {
    axios.get(`${API}/videos/${videoId}/comments`)
      .then(res => setComments(res.data))
      .catch(() => {});
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    playClick();
    if (navigator.vibrate) navigator.vibrate(10);
    try {
      const res = await axios.post(`${API}/videos/${videoId}/comments`, {
        user_id: user.id,
        content: newComment.trim()
      });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (err) {
      alert('Erro ao comentar.');
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 20, fontSize: '1.2rem', fontWeight: 600 }}>
        Comentários ({comments.length})
      </h3>
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            className="form-input"
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              flex: 1, padding: '10px 16px', background: '#121212', border: '1px solid #2a2a2a',
              borderRadius: 24, color: '#fff', fontSize: '0.9rem', outline: 'none',
            }}
          />
          <button type="submit" style={{
            background: '#00e676', color: '#000', border: 'none', borderRadius: 24,
            padding: '8px 20px', fontWeight: 600, cursor: 'pointer',
          }}>
            Enviar
          </button>
        </form>
      )}
      {comments.length === 0 ? (
        <p style={{ color: '#888' }}>Seja o primeiro a comentar.</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} style={{
            display: 'flex', gap: 12, marginBottom: 20,
            animation: 'fadeInUp 0.3s ease both',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: '#202020',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#aaa', fontSize: '0.8rem', flexShrink: 0,
            }}>
              {comment.profiles?.avatar_url ? (
                <img src={comment.profiles.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%' }} alt="" />
              ) : (
                (comment.profiles?.username || 'U')[0].toUpperCase()
              )}
            </div>
            <div>
              <strong style={{ fontSize: '0.9rem', marginRight: 8 }}>
                {comment.profiles?.username || 'Usuário'}
              </strong>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>
                {new Date(comment.created_at).toLocaleDateString('pt-BR')}
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', lineHeight: 1.4 }}>
                {comment.content}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
