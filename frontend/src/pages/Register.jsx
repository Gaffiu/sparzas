import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await register(email, password); navigate('/login'); } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ maxWidth: 420, margin: '60px auto', padding: 32, background: '#0f0f0f', borderRadius: 24 }}>
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit}>
        <input style={input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={input} type="password" placeholder="Senha (mín. 6)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <button type="submit" style={{ width:'100%', padding:14, background:'#00e676', border:'none', borderRadius:24, color:'#000', fontWeight:600, marginTop:20 }}>Registrar</button>
      </form>
      <p style={{ textAlign:'center', marginTop:20 }}>Já tem conta? <Link to="/login">Faça login</Link></p>
    </div>
  );
}

const input = {
  width: '100%',
  padding: 14,
  background: '#121212',
  border: '1px solid #2a2a2a',
  borderRadius: 10,
  color: '#fff',
  fontSize: '1rem',
  marginTop: 15,
};
