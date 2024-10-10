import { ThemeContext } from '@/context/ThemeProvider';
import { useContext } from 'react';

export const useTheme = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};
