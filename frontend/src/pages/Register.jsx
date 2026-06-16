import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 420, margin: '60px auto', padding: 32, background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 32 }}>Criar conta</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input className="form-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-input" type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        {error && <p style={{ color: 'salmon' }}>{error}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>Registrar</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)' }}>
        Já tem conta? <Link to="/login" style={{ color: 'var(--green-neon)' }}>Faça login</Link>
      </p>
    </div>
  );
}
