import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';

export default function PremiumModal({ onClose }) {
  const { addToast } = useToast();
  const handleSubscribe = () => {
    localStorage.setItem('sparzas_premium', 'true');
    addToast('Bem-vindo ao SPARZAS Premium!', 'success');
    onClose();
  };
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-container" onClick={e => e.stopPropagation()}>
        <h2 style={{ color: '#00e676' }}>SPARZAS Premium</h2>
        <p>Vídeos sem anúncios</p>
        <p>Download offline</p>
        <p>Acesso antecipado</p>
        <button onClick={handleSubscribe} className="btn btn-primary" style={{ width: '100%', marginTop: 16 }}>Assinar por R$ 9,90/mês</button>
        <button onClick={onClose} className="sheet-cancel">Depois</button>
      </div>
    </div>
  );
}
