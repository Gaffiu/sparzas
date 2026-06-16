import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const splash = document.getElementById('splash');
if (splash) {
  const hideSplash = () => {
    splash.style.opacity = '0';
    setTimeout(() => splash.remove(), 400);
  };
  setTimeout(hideSplash, 600);
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
