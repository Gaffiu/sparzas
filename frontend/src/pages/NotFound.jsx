import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign:'center', marginTop:100 }}>
      <h1 style={{ fontSize:72, color:'#00e676', marginBottom:8 }}>404</h1>
      <p style={{ fontSize:'1.2rem', marginBottom:24 }}>Pagina nao encontrada.</p>
      <Link to="/" style={{ color:'#00e676', fontWeight:600, fontSize:'1.1rem' }}>Voltar ao inicio</Link>
    </div>
  );
}
