import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

function AmbientBackground() {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const blob1 = isLight ? 'bg-gold/70' : 'bg-gold/30';
  const blob2 = isLight ? 'bg-mint/60' : 'bg-mint/25';
  const blob3 = isLight ? 'bg-amber/60' : 'bg-amber/25';
  const blur = isLight ? 'blur-[70px]' : 'blur-[110px]';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full ${blob1} ${blur}`}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-1/3 -right-40 w-[32rem] h-[32rem] rounded-full ${blob2} ${blur}`}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -bottom-20 left-1/3 w-[30rem] h-[30rem] rounded-full ${blob3} ${blur}`}
      />
    </div>
  );
}

export default AmbientBackground;