import { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function BugReport() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [description, setDescription] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      await supabase.from('reports').insert([{
        reporter_id: user?.id,
        target_type: 'bug',
        target_id: '00000000-0000-0000-0000-000000000000',
        reason: 'bug_report',
        details: description.trim()
      }]);
      setSent(true);
      addToast('Relatório enviado. Obrigado!', 'success');
    } catch (err) {
      addToast('Erro ao enviar.', 'error');
    }
  };

  if (sent) return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h2>Obrigado!</h2>
      <p>Seu relatório foi enviado para nossa equipe.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 20 }}>
      <h2>Relatar um problema</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <textarea
          className="search-input"
          rows={5}
          placeholder="Descreva o que aconteceu..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          style={{ resize: 'vertical' }}
        />
        <button type="submit" className="btn btn-primary">Enviar relatório</button>
      </form>
    </div>
  );
}
