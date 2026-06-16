import { useState } from 'react';
import PremiumModal from '../components/PremiumModal';
import { useNavigate } from 'react-router-dom';

export default function Premium() {
  const [showModal, setShowModal] = useState(true);
  const isPremium = localStorage.getItem('sparzas_premium') === 'true';
  const navigate = useNavigate();

  if (isPremium) return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h2>Você já é Premium!</h2>
      <button onClick={() => navigate('/')} className="btn btn-primary">Ir para Início</button>
    </div>
  );

  return showModal ? <PremiumModal onClose={() => setShowModal(false)} /> : null;
}
