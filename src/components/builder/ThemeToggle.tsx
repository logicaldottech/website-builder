import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useBuilderStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-md text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
      title="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
