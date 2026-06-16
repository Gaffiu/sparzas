import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const steps = ['Bem-vindo ao SPARZAS!', 'Publique vídeos e ganhe inscritos.', 'Personalize seu canal e divirta-se.'];
  return (
    <div style={{ textAlign:'center', padding:40 }}>
      <h1>{steps[step]}</h1>
      {step < 2 ? <button onClick={() => setStep(step+1)} className="btn btn-primary">Próximo</button> : <button onClick={() => navigate('/')} className="btn btn-primary">Começar</button>}
    </div>
  );
}
