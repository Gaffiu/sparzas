import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Supabase pode retornar que o usuário precisa confirmar o email
      if (data?.user?.identities?.length === 0) {
        setError('Este email já está cadastrado.');
      } else {
        setMessage('Registro realizado! Verifique seu email (se configurado) ou faça login.');
        setTimeout(() => navigate('/login'), 2000);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto' }}>
      <h1>Criar conta no SPARZAS</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 10, fontSize: 16 }}
        />
        <input
          type="password"
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 10, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, backgroundColor: '#ff6b00', color: '#fff', border: 'none', borderRadius: 5, fontSize: 16 }}>
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
      <p style={{ marginTop: 15 }}>
        Já tem conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}
