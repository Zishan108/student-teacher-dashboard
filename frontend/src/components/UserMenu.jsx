import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-line bg-surface hover:border-gold/50 transition"
      >
        <span className="w-7 h-7 rounded-full bg-gold text-ink font-semibold text-xs flex items-center justify-center font-mono shrink-0">
          {getInitials(user?.name)}
        </span>
        <span className="text-sm text-ink-text max-w-[120px] truncate hidden sm:inline">{user?.name}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-surface border border-line rounded-xl shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-line">
              <p className="text-sm text-ink-text truncate">{user?.name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
              <p className="text-[10px] text-gold font-mono uppercase tracking-widest mt-1">
                {user?.role}
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-rose hover:bg-rose/10 transition"
            >
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        body="You'll need to sign in again to access your dashboard."
        confirmLabel="Sign out"
        danger
        onConfirm={logout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export default UserMenu;