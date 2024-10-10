import { THEME_OPTIONS } from '@/constants/constants';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { createContext } from 'react';

type Theme = (typeof THEME_OPTIONS)[number];

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

type ThemeProviderProps = {
  children: React.ReactNode;
};
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useLocalStorage<Theme>('THEME', 'system');

  const changeTheme = (theme: Theme) => {
    const isDark =
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
    setTheme(theme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: changeTheme, isDark: document.documentElement.classList.contains('dark') }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
