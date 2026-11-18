import { useState, useEffect } from 'react';
import type { ThemeMode } from '../types';

export function useTheme(initialTheme: ThemeMode = 'system') {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('markflow_theme') as ThemeMode | null;
    return saved || initialTheme;
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('markflow_theme', theme);
    const root = document.documentElement;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const darkActive =
        theme === 'dark' || (theme === 'system' && mediaQuery.matches);

      setIsDark(darkActive);
      if (darkActive) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const listener = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  return { theme, setTheme, isDark };
}
