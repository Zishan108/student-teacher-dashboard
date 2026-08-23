import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import AmbientBackground from '../components/AmbientBackground';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, role });
      const { token, user } = res.data;
      login(token, user);
      navigate(user.role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-sans transition-colors duration-300 relative">
      <AmbientBackground />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-sm"
      >
        <motion.div variants={item}>
          <Link to="/" className="block text-center mb-8">
            <p className="font-display text-4xl text-ink-text tracking-tight">Joineazy</p>
            <p className="text-muted text-sm mt-2 font-mono uppercase tracking-widest text-[11px]">
              Group &amp; Assignment Registry
            </p>
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="bg-surface border border-line rounded-2xl p-8 transition-colors duration-300"
        >
          <h1 className="font-display text-xl text-ink-text mb-6">Create account</h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose/10 border border-rose/30 text-rose text-sm rounded-lg p-3 mb-4 overflow-hidden"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={item}>
              <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition"
                placeholder="Zishan Sheikh"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition"
                placeholder="you@university.edu"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition"
                placeholder="••••••••"
              />
            </motion.div>

            <motion.div variants={item}>
              <label className="block text-muted text-xs font-mono uppercase tracking-wider mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-high text-ink-text border border-line focus:outline-none focus:border-gold transition"
              >
                <option value="student">Student</option>
                <option value="admin">Professor (Admin)</option>
              </select>
            </motion.div>

            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-soft text-ink font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Register'}
            </motion.button>
          </form>
        </motion.div>

        <motion.p variants={item} className="text-muted text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Register;