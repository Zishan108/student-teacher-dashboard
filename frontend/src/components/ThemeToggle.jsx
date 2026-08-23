import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-12 h-7 rounded-full bg-surface-high border border-line flex items-center px-1 transition-colors duration-300"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-gold flex items-center justify-center"
        style={{ marginLeft: isLight ? 'auto' : 0 }}
      >
        {isLight ? <Sun size={12} className="text-ink" /> : <Moon size={12} className="text-ink" />}
      </motion.div>
    </button>
  );
}

export default ThemeToggle;