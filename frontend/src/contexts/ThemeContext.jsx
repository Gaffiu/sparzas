import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const themes = {
  dark: { name: 'Escuro', className: '' },
  light: { name: 'Claro', className: 'light-theme' },
  green: { name: 'Verde', className: 'green-theme' },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('sparzas_theme');
    if (saved && themes[saved]) setTheme(saved);
  }, []);

  const changeTheme = (key) => {
    setTheme(key);
    localStorage.setItem('sparzas_theme', key);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], themeKey: theme, changeTheme }}>
      <div className={themes[theme].className} style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
