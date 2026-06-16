import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Remove splash screen após o carregamento do React
const rootElement = document.getElementById('root');
const splash = document.getElementById('splash');
if (splash) {
  // Esconde o splash suavemente e remove após a transição
  const hideSplash = () => {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  };
  // Se o React montar rápido, esconde após um pequeno delay
  setTimeout(hideSplash, 600);
  // Também podemos observar quando o root tiver conteúdo
  const observer = new MutationObserver(() => {
    if (rootElement.childElementCount > 0) {
      hideSplash();
      observer.disconnect();
    }
  });
  observer.observe(rootElement, { childList: true, subtree: true });
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
