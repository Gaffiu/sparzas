import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const splash = document.getElementById('splash');

// Função para esconder o splash com segurança
function hideSplash() {
  if (splash) {
    splash.style.opacity = '0';
    setTimeout(() => {
      if (splash.parentNode) splash.style.display = 'none';
    }, 400);
  }
}

// Tenta renderizar o app
try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Observer para remover o splash assim que o conteúdo aparecer
  if (splash) {
    const observer = new MutationObserver(() => {
      if (rootElement.childElementCount > 0) {
        hideSplash();
        observer.disconnect();
      }
    });
    observer.observe(rootElement, { childList: true, subtree: true });

    // Timeout de segurança adicional (5s) para o próprio React
    setTimeout(() => {
      if (splash.style.display !== 'none') {
        hideSplash();
        observer.disconnect();
      }
    }, 5000);
  }
} catch (error) {
  console.error('Erro ao iniciar o app:', error);
  if (splash) {
    const errorEl = document.getElementById('splash-error');
    if (errorEl) errorEl.style.display = 'block';
    hideSplash();
  }
}
