import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

function ConfirmCheckmark({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.15, 1] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full bg-mint/20 border-2 border-mint flex items-center justify-center backdrop-blur-sm"
          >
            <motion.div
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
            >
              <Check size={44} className="text-mint" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmCheckmark;