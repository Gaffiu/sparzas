import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const API = import.meta.env.VITE_API_URL;

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`${API}/videos/${videoId}/comments`).then(res => setComments(res.data));
  }, [videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const res = await axios.post(`${API}/videos/${videoId}/comments`, { user_id: user.id, content: newComment });
    setComments(prev => [...prev, res.data]);
    setNewComment('');
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ marginBottom: 20, fontSize: '1.2rem' }}>Comentários ({comments.length})</h3>
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input className="form-input" placeholder="Adicione um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ flex: 1, borderRadius: 24 }} />
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      )}
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <img className="comment-avatar" src={comment.profiles?.avatar_url || 'https://via.placeholder.com/40'} alt="" />
          <div className="comment-body">
            <strong>{comment.profiles?.username || 'Usuário'}</strong>
            <span>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
