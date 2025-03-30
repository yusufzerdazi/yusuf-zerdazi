import { useState, useEffect } from 'react';

// This hook returns the current color mode (light or dark)
// and a function to toggle it
export const useColorMode = (): [string, () => void] => {
  const [colorMode, setColorMode] = useState('light');

  useEffect(() => {
    // Check if user has dark mode preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setColorMode(isDarkMode ? 'dark' : 'light');
    
    // Update if system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setColorMode(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = () => {
    setColorMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return [colorMode, toggleColorMode];
}; 