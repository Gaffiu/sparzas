import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoiceSearch({ onClose }) {
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();
  const recognition = useRef(null);

  const start = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Busca por voz não suportada neste navegador.');
    recognition.current = new SpeechRecognition();
    recognition.current.lang = 'pt-BR';
    recognition.current.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      navigate(`/?search=${encodeURIComponent(transcript)}`);
      onClose();
    };
    recognition.current.start();
    setListening(true);
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-container" onClick={e => e.stopPropagation()} style={{ maxWidth: 300, margin: 'auto', textAlign: 'center', borderRadius: 20 }}>
        <button onClick={start} className="btn btn-primary" style={{ width: '100%', padding: 16 }}>
          {listening ? '🎤 Ouvindo...' : '🎤 Tocar para falar'}
        </button>
        <button onClick={onClose} className="sheet-cancel">Cancelar</button>
      </div>
    </div>
  );
}
