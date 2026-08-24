import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';

function Layout({ tabs, activeTab, onTabChange, roleLabel, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (id) => {
    onTabChange(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <>
      <Link to="/" className="block px-6 py-6 border-b border-line hover:bg-surface-high/50 transition">
        <p className="font-display text-2xl tracking-tight">Joineazy</p>
        <p className="text-[11px] text-muted mt-1 font-mono uppercase tracking-widest">{roleLabel}</p>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabClick(t.id)}
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
        <Link
          to="/"
          className="block w-full text-center text-[11px] font-mono uppercase tracking-wider text-muted border border-line rounded-lg py-2 hover:text-ink-text hover:border-gold/50 transition"
        >
          ← Back to home
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ink text-ink-text flex font-sans transition-colors duration-300">
      <aside className="hidden md:flex w-64 border-r border-line bg-surface flex-col shrink-0 transition-colors duration-300">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed top-0 left-0 h-full w-64 bg-surface border-r border-line flex flex-col z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 border-b border-line bg-surface/50 flex items-center justify-between md:justify-end gap-4 px-4 md:px-8 shrink-0 transition-colors duration-300">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-ink-text p-2 -ml-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-5 md:px-10 py-8 md:py-12">
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
    </div>
  );
}

export default Layout;