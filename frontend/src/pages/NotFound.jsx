import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }} className="fade-in">
      <h1 style={{ fontSize: 80, color: 'var(--green-neon)' }}>404</h1>
      <p>Página não encontrada</p>
      <Link to="/" style={{ color: 'var(--green-aqua)' }}>Voltar ao início</Link>
    </div>
  );
}
