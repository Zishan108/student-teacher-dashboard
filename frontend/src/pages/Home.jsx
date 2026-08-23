import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import AmbientBackground from '../components/AmbientBackground';
import Counter from '../components/Counter';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const FEATURES = [
  {
    title: 'Form your own groups',
    body: 'Create a group, invite teammates by email, and manage membership without waiting on an admin.',
  },
  {
    title: 'Two-step confirmation',
    body: 'Submit externally, then confirm here — a deliberate two-tap flow prevents accidental mark-offs.',
  },
  {
    title: 'Live progress tracking',
    body: 'Professors see group-wise and student-wise completion the moment a submission is confirmed.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Form a group',
    body: "Students create a group and add teammates by email — no professor setup required to get started.",
  },
  {
    n: '02',
    title: 'Submit externally, confirm here',
    body: "Work gets uploaded to the OneDrive link the professor shares, then confirmed in two deliberate taps.",
  },
  {
    n: '03',
    title: 'Track it live',
    body: "Every confirmation updates the professor's dashboard instantly — no chasing status over email.",
  },
];

const STATS = [
  { to: 100, suffix: '%', label: 'Role-based access' },
  { to: 2, suffix: '-step', label: 'Submission confirmation' },
  { to: 0, suffix: '', label: 'Spreadsheets needed' },
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-ink-text font-sans transition-colors duration-300 relative">
      <AmbientBackground />

      <div className="relative z-10">
        <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <p className="font-display text-xl tracking-tight">Joineazy</p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin' : '/student'}
                className="text-sm bg-gold hover:bg-gold-soft text-ink px-4 py-2 rounded-lg font-semibold transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted hover:text-ink-text transition">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-gold hover:bg-gold-soft text-ink px-4 py-2 rounded-lg font-semibold transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </header>

        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center"
        >
          <motion.p variants={item} className="font-mono text-[11px] text-gold uppercase tracking-[0.2em] mb-4">
            Group &amp; Assignment Registry
          </motion.p>
          <motion.h1 variants={item} className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6">
            Every group.
            <br />
            Every submission.
            <br />
            One ledger.
          </motion.h1>
          <motion.p variants={item} className="text-muted text-lg max-w-xl mx-auto mb-10">
            Joineazy replaces the spreadsheet your class outgrew — students self-organize into
            groups, professors watch the whole cohort finish in real time.
          </motion.p>
          <motion.div variants={item} className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="bg-gold hover:bg-gold-soft text-ink font-semibold px-6 py-3 rounded-lg transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Create your account
            </Link>
            <Link
              to="/login"
              className="border border-line text-ink-text px-6 py-3 rounded-lg transition hover:border-gold"
            >
              I already have one
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          variants={container}
          className="border-y border-line bg-surface/50 transition-colors duration-300"
        >
          <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
            {STATS.map((s) => (
              <motion.div key={s.label} variants={item}>
                <p className="font-display text-4xl text-gold">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="text-muted text-xs font-mono uppercase tracking-wider mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-5"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-surface border border-line rounded-xl p-6 transition-colors duration-300"
            >
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </motion.section>

        <section className="max-w-3xl mx-auto px-6 pb-24">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] text-gold uppercase tracking-[0.2em] mb-3 text-center"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl text-center mb-14"
          >
            Three steps, start to finish
          </motion.h2>

          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex gap-6 items-start"
              >
                <span className="font-display text-4xl text-gold/40 shrink-0 w-14">{s.n}</span>
                <div className="border-l border-line pl-6 pb-2">
                  <h3 className="font-display text-xl mb-2">{s.title}</h3>
                  <p className="text-muted text-sm leading-relaxed max-w-md">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-5"
        >
          <motion.div
            variants={item}
            className="bg-surface border border-line rounded-2xl p-8 transition-colors duration-300"
          >
            <p className="font-mono text-[11px] text-gold uppercase tracking-widest mb-3">For students</p>
            <h3 className="font-display text-2xl mb-3">Run your own group</h3>
            <p className="text-muted text-sm leading-relaxed">
              No more "who's submitting this." Create your group, see every assignment in one place,
              and confirm submissions with a flow that can't be mis-tapped by accident.
            </p>
          </motion.div>
          <motion.div
            variants={item}
            className="bg-surface border border-line rounded-2xl p-8 transition-colors duration-300"
          >
            <p className="font-mono text-[11px] text-mint uppercase tracking-widest mb-3">For professors</p>
            <h3 className="font-display text-2xl mb-3">See the whole cohort</h3>
            <p className="text-muted text-sm leading-relaxed">
              Post an assignment once, target every group or a subset, and watch confirmation status
              and completion rate update live — no manual roll call.
            </p>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="max-w-3xl mx-auto px-6 pb-24 text-center"
        >
          <h2 className="font-display text-3xl mb-4">Ready to open the register?</h2>
          <p className="text-muted mb-8">Free to set up. Takes less than a minute.</p>
          <Link
            to="/register"
            className="inline-block bg-gold hover:bg-gold-soft text-ink font-semibold px-6 py-3 rounded-lg transition hover:scale-[1.03] active:scale-[0.98]"
          >
            Create your account
          </Link>
        </motion.section>

        <footer className="border-t border-line py-8 text-center transition-colors duration-300">
          <p className="text-muted text-xs font-mono uppercase tracking-widest">Joineazy — Task 1</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;