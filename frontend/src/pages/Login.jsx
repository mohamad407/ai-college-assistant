import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiSparklingLine,
  RiArrowRightLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import Loading from '@components/common/Loading';

// ── Stagger animation helpers ────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// ── Floating geometric orbs ──────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full
                      bg-navy-700/20 blur-3xl" />
      <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full
                      bg-navy-600/15 blur-2xl" />
      <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full
                      bg-amber-500/8 blur-2xl" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const login     = useAuthStore((s) => s.login);

  const from = location.state?.from?.pathname ?? '/dashboard';

  const [form, setForm]           = useState({ email: '', password: '' });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState({});

  // ── Validation ─────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.email.trim())                  e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)                      e.password = 'Password is required.';
    return e;
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! 🎓');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Invalid credentials. Please try again.';
      toast.error(msg);
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center
                    relative px-4">
      <Orbs />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-md"
      >
        {/* ── Logo ──────────────────────────────────────────────── */}
        <motion.div variants={item} className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-800
                          flex items-center justify-center shadow-glow-navy mb-4">
            <RiSparklingLine className="text-white" size={26} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back
          </h1>
          <p className="font-body text-sm text-slate-400 mt-1">
            Sign in to your AcademiQ account
          </p>
        </motion.div>

        {/* ── Card ──────────────────────────────────────────────── */}
        <motion.div
          variants={item}
          className="bg-surface-100 border border-white/8 rounded-3xl p-8
                     shadow-card backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Email */}
            <div>
              <label className="font-body text-xs text-slate-400 uppercase tracking-wider
                                block mb-2">
                Email address
              </label>
              <div className="relative">
                <RiMailLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, email: e.target.value }));
                    setErrors((er) => ({ ...er, email: '' }));
                  }}
                  placeholder="you@university.edu"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface-200
                              border font-body text-sm text-white placeholder-slate-600
                              focus:outline-none focus:ring-1 transition-all
                              ${errors.email
                                ? 'border-red-500/60 focus:ring-red-500/30'
                                : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
                              }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 font-body text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-body text-xs text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="font-body text-xs text-navy-400 hover:text-navy-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <RiLockPasswordLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={16}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    setErrors((er) => ({ ...er, password: '' }));
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-surface-200
                              border font-body text-sm text-white placeholder-slate-600
                              focus:outline-none focus:ring-1 transition-all
                              ${errors.password
                                ? 'border-red-500/60 focus:ring-red-500/30'
                                : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
                              }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <RiEyeOffLine size={16} /> : <RiEyeLine size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 font-body text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Server error */}
            {errors.server && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20
                              px-4 py-3">
                <p className="font-body text-xs text-red-400">{errors.server}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-600 to-navy-500
                         text-white font-body font-semibold text-sm
                         hover:from-navy-500 hover:to-navy-400
                         focus:outline-none focus:ring-2 focus:ring-navy-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-glow-navy/30 hover:shadow-glow-navy
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loading variant="button" label="Signing in…" />
              ) : (
                <>
                  Sign in
                  <RiArrowRightLine size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Register link ────────────────────────────────────── */}
        <motion.p
          variants={item}
          className="text-center font-body text-sm text-slate-500 mt-6"
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-navy-400 hover:text-navy-300 font-semibold transition-colors"
          >
            Create one free
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
