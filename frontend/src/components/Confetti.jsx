import { useEffect, useState } from 'react';

export default function Confetti() {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i, left: Math.random() * 100, delay: Math.random() * 2, color: ['#00e676', '#1de9b6', '#ff453a'][i % 3]
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 4000);
  }, []);

  return particles.map(p => (
    <div key={p.id} style={{
      position: 'fixed', top: -20, left: `${p.left}%`, width: 10, height: 10,
      background: p.color, borderRadius: 2, zIndex: 1000,
      animation: `confettiFall 3s ease-out ${p.delay}s forwards`
    }} />
  ));
}
