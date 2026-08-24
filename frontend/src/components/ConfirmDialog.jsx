import { motion, AnimatePresence } from 'framer-motion';

function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-line rounded-2xl p-6 max-w-sm w-full"
          >
            <h3 className="font-display text-lg text-ink-text mb-2">{title}</h3>
            <p className="text-muted text-sm mb-6">{body}</p>
            <div className="flex justify-end gap-3">
              <button onClick={onCancel} className="text-sm text-muted px-4 py-2 hover:text-ink-text transition">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`text-sm px-4 py-2 rounded-lg font-semibold transition ${
                  danger ? 'bg-rose text-white hover:bg-rose/90' : 'bg-gold text-ink hover:bg-gold-soft'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;