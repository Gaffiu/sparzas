import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchHistory() {
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('sparzas_search_history') || '[]'));
  const navigate = useNavigate();

  const clearHistory = () => {
    localStorage.removeItem('sparzas_search_history');
    setHistory([]);
  };

  const searchAgain = (term) => {
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Histórico de buscas</h2>
        {history.length > 0 && <button onClick={clearHistory} className="btn btn-outline">Limpar</button>}
      </div>
      {history.length === 0 ? <p style={{ color: '#888' }}>Nenhuma busca recente.</p> :
        history.map((term, i) => (
          <div key={i} onClick={() => searchAgain(term)} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
            {term}
          </div>
        ))
      }
    </div>
  );
}
