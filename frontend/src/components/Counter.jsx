import { useState } from 'react';
import { motion } from 'framer-motion';

function Counter({ to, suffix = '' }) {
  const [value, setValue] = useState(0);

  const handleEnter = () => {
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  return (
    <motion.span onViewportEnter={handleEnter} viewport={{ once: true }}>
      {value}
      {suffix}
    </motion.span>
  );
}

export default Counter;