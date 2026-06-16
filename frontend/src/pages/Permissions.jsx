import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Permissions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cameraGranted, setCameraGranted] = useState(false);
  const [micGranted, setMicGranted] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const requestMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      setCameraGranted(true);
      setMicGranted(true);
    } catch (err) {
      alert('Permissões de câmera/microfone são necessárias para publicar vídeos.');
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 20, textAlign: 'center' }}>
      <h2>Bem-vindo ao SPARZAS PLAY</h2>
      <p>Para uma experiência completa, permita o acesso à câmera e ao microfone.</p>
      <button onClick={requestMedia} className="btn btn-primary" style={{ margin: '12px 0' }}>
        {cameraGranted && micGranted ? 'Permitido ✓' : 'Permitir câmera e microfone'}
      </button>
      <br />
      <button onClick={handleContinue} className="btn btn-outline">Continuar sem permitir</button>
    </div>
  );
}
