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
    const res = await axios.post(`${API}/videos/${videoId}/comments`, {
      user_id: user.id,
      content: newComment
    });
    setComments([...comments, res.data]);
    setNewComment('');
  };

  return (
    <div>
      <h3 style={{ margin: '20px 0 10px' }}>Comentários</h3>
      {user && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Adicione um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ flex: 1, padding: 8, borderRadius: 20, border: '1px solid #333', background: '#121212', color: 'white' }}
          />
          <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Comentar</button>
        </form>
      )}
      {comments.map(comment => (
        <div key={comment.id} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <img src={comment.profiles?.avatar_url || 'https://via.placeholder.com/32'} style={{ width: 32, height: 32, borderRadius: '50%' }} alt="" />
          <div>
            <strong>{comment.profiles?.username}</strong> • <small>{new Date(comment.created_at).toLocaleDateString()}</small>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
