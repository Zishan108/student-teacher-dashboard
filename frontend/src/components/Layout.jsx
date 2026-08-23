import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

function Layout({ tabs, activeTab, onTabChange, roleLabel, children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-ink text-ink-text flex font-sans transition-colors duration-300">
      <aside className="w-64 border-r border-line bg-surface flex flex-col shrink-0 transition-colors duration-300">
        <div className="px-6 py-6 border-b border-line">
          <p className="font-display text-2xl tracking-tight">Joineazy</p>
          <p className="text-[11px] text-muted mt-1 font-mono uppercase tracking-widest">
            {roleLabel}
          </p>
        </div>

        <div className="px-6 py-3 border-b border-line flex items-center justify-between">
          <span className="text-[11px] text-muted font-mono uppercase tracking-wider">Theme</span>
          <ThemeToggle />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              className={`relative w-full text-left pl-4 pr-3 py-2.5 text-sm transition-colors ${
                activeTab === t.id ? 'text-gold' : 'text-muted hover:text-ink-text'
              }`}
            >
              {activeTab === t.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-surface-high border-l-2 border-gold rounded-r-lg"
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-line">
          <p className="text-sm truncate">{user?.name}</p>
          <p className="text-xs text-muted truncate mb-3">{user?.email}</p>
          <button
            onClick={logout}
            className="w-full text-[11px] font-mono uppercase tracking-wider text-rose border border-rose/30 rounded-lg py-2 hover:bg-rose/10 transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-10 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Layout;