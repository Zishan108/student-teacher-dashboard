import { motion } from 'framer-motion';

const STYLES = {
  pending: { label: 'Not submitted', dot: 'bg-muted', text: 'text-muted', border: 'border-line' },
  step1_confirmed: { label: 'Awaiting confirm', dot: 'bg-amber', text: 'text-amber', border: 'border-amber/30' },
  confirmed: { label: 'Confirmed', dot: 'bg-mint', text: 'text-mint', border: 'border-mint/30' },
};

function StatusStamp({ status }) {
  const s = STYLES[status] || STYLES.pending;
  return (
    <motion.span
      key={status}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${s.border} ${s.text} font-mono text-[11px] uppercase tracking-wider whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </motion.span>
  );
}

export default StatusStamp;