import { createContext, useContext, useState } from 'react';

const translations = {
  pt: {
    home: 'Início', explore: 'Explorar', shorts: 'Shorts', subscriptions: 'Inscrições',
    library: 'Biblioteca', history: 'Histórico', liked: 'Curtidos', trending: 'Em alta',
    music: 'Música', gaming: 'Jogos', sports: 'Esportes', upload: 'Publicar',
    login: 'Entrar', logout: 'Sair', settings: 'Configurações', search: 'Pesquisar vídeos...'
  },
  en: {
    home: 'Home', explore: 'Explore', shorts: 'Shorts', subscriptions: 'Subscriptions',
    library: 'Library', history: 'History', liked: 'Liked', trending: 'Trending',
    music: 'Music', gaming: 'Gaming', sports: 'Sports', upload: 'Upload',
    login: 'Sign in', logout: 'Sign out', settings: 'Settings', search: 'Search videos...'
  }
};

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('sparzas_lang') || 'pt');
  const t = (key) => translations[lang]?.[key] || key;
  const changeLanguage = (l) => { setLang(l); localStorage.setItem('sparzas_lang', l); };
  return <LanguageContext.Provider value={{ lang, t, changeLanguage }}>{children}</LanguageContext.Provider>;
}
