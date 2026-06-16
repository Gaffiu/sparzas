import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSound } from '../hooks/useSound';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { playClick } = useSound();

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClick();
    try {
      await register(email, password);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth:420, margin:'60px auto', padding:40, background:'#0f0f0f', borderRadius:24, border:'1px solid rgba(255,255,255,0.05)' }}>
      <h1 style={{ textAlign:'center', marginBottom:32, fontSize:'1.8rem' }}>Criar conta</h1>
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <input style={fieldStyle} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={fieldStyle} type="password" placeholder="Senha (minimo 6 caracteres)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        {error && <p style={{ color:'#ff6b6b', margin:0 }}>{error}</p>}
        <button type="submit" style={btnStyle}>Registrar</button>
      </form>
      <p style={{ textAlign:'center', marginTop:24, color:'#aaa' }}>
        Ja tem conta? <Link to="/login" style={{ color:'#00e676', fontWeight:600 }}>Entrar</Link>
      </p>
    </div>
  );
}

const fieldStyle = {
  width:'100%', padding:14, background:'#121212', border:'1px solid #2a2a2a',
  borderRadius:12, color:'#fff', fontSize:'1rem', outline:'none',
};
const btnStyle = {
  width:'100%', padding:14, background:'#00e676', border:'none', borderRadius:28,
  color:'#000', fontWeight:700, fontSize:'1rem', cursor:'pointer', marginTop:8,
};
