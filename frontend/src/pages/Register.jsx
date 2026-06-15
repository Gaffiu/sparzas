import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="fadeIn" style={{ maxWidth: 400, margin: '40px auto', padding: 20 }}>
      <h1>Criar conta</h1>
      <form onSubmit={handleRegister}>
        <div className="form-group"><input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="form-group"><input type="password" placeholder="Senha (mín. 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Registrar</button>
      </form>
      <p style={{ marginTop: 15 }}>Já tem conta? <Link to="/login">Faça login</Link></p>
    </div>
  );
}
