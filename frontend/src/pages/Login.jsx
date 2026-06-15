import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fadeIn" style={{ maxWidth: 400, margin: '40px auto', padding: 20 }}>
      <h1>Entrar no SPARZAS</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group"><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required /></div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Entrar</button>
      </form>
      <p style={{ marginTop: 15 }}>Não tem conta? <Link to="/register">Registre-se</Link></p>
    </div>
  );
}
