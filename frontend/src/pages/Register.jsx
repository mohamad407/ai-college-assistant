import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiUserLine,
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiSparklingLine,
  RiArrowRightLine,
  RiGraduationCapLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import Loading from '@components/common/Loading';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const ROLES = ['Undergraduate', 'Postgraduate', 'PhD Researcher', 'Faculty', 'Staff'];

function Orbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full
                      bg-navy-700/20 blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full
                      bg-amber-600/8 blur-3xl" />
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

// ── Inline field component ───────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div>
      <label className="font-body text-xs text-slate-400 uppercase tracking-wider block mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 font-body text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate  = useNavigate();
  const register  = useAuthStore((s) => s.register);

  const [form, setForm] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    password:  '',
    confirm:   '',
    role:      'Undergraduate',
    university:'',
  });
  const [showPass, setShowPass]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [errors, setErrors]         = useState({});

  function set(key) {
    return (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setErrors((er) => ({ ...er, [key]: '' }));
    };
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!form.email.trim())            e.email    = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password)                e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters.';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match.';
    if (!form.university.trim())       e.university = 'University is required.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register({
        firstName:  form.firstName.trim(),
        lastName:   form.lastName.trim(),
        email:      form.email.trim(),
        password:   form.password,
        role:       form.role,
        university: form.university.trim(),
      });
      toast.success('Account created! Welcome to AcademiQ 🎓');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Registration failed. Please try again.';
      toast.error(msg);
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  }

  const inputBase = (key) =>
    `w-full px-4 py-3 rounded-xl bg-surface-200 border font-body text-sm
     text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
     ${errors[key]
       ? 'border-red-500/60 focus:ring-red-500/30'
       : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
     }`;

  const iconInput = (key, extra = '') =>
    `w-full pl-10 ${extra} py-3 rounded-xl bg-surface-200 border font-body text-sm
     text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
     ${errors[key]
       ? 'border-red-500/60 focus:ring-red-500/30'
       : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
     }`;

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center
                    relative px-4 py-12">
      <Orbs />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo */}
        <motion.div variants={item} className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-800
                          flex items-center justify-center shadow-glow-navy mb-4">
            <RiSparklingLine className="text-white" size={26} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="font-body text-sm text-slate-400 mt-1">
            Your AI-powered study companion awaits
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={item}
          className="bg-surface-100 border border-white/8 rounded-3xl p-8
                     shadow-card backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" error={errors.firstName}>
                <div className="relative">
                  <RiUserLine
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    size={15}
                  />
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={set('firstName')}
                    placeholder="Ada"
                    className={iconInput('firstName', 'pr-4')}
                  />
                </div>
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={set('lastName')}
                  placeholder="Lovelace"
                  className={inputBase('lastName')}
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email address" error={errors.email}>
              <div className="relative">
                <RiMailLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@university.edu"
                  className={iconInput('email', 'pr-4')}
                />
              </div>
            </Field>

            {/* University */}
            <Field label="University / Institution" error={errors.university}>
              <div className="relative">
                <RiGraduationCapLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  type="text"
                  value={form.university}
                  onChange={set('university')}
                  placeholder="e.g. MIT, Oxford, IIT Bombay"
                  className={iconInput('university', 'pr-4')}
                />
              </div>
            </Field>

            {/* Role */}
            <Field label="Role" error={errors.role}>
              <select
                value={form.role}
                onChange={set('role')}
                className={`${inputBase('role')} appearance-none cursor-pointer`}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} className="bg-surface-200">
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password}>
              <div className="relative">
                <RiLockPasswordLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 8 characters"
                  className={iconInput('password', 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>
            </Field>

            {/* Confirm password */}
            <Field label="Confirm password" error={errors.confirm}>
              <div className="relative">
                <RiLockPasswordLine
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={15}
                />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat password"
                  className={iconInput('confirm', 'pr-10')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirm ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>
            </Field>

            {/* Server error */}
            {errors.server && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                <p className="font-body text-xs text-red-400">{errors.server}</p>
              </div>
            )}

            {/* ToS note */}
            <p className="font-body text-2xs text-slate-500 leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="text-navy-400 hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-navy-400 hover:underline">Privacy Policy</a>.
            </p>

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
                <Loading variant="button" label="Creating account…" />
              ) : (
                <>
                  Create account
                  <RiArrowRightLine size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Login link */}
        <motion.p
          variants={item}
          className="text-center font-body text-sm text-slate-500 mt-6"
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-navy-400 hover:text-navy-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
