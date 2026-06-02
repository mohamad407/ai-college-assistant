import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RiUserLine,
  RiMailLine,
  RiGraduationCapLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
  RiShieldCheckLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiDeleteBinLine,
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuthStore } from '@store/authStore';
import Loading from '@components/common/Loading';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
});

const ROLES = ['Undergraduate', 'Postgraduate', 'PhD Researcher', 'Faculty', 'Staff'];

// ── Section card ─────────────────────────────────────────────────────────────
function Card({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-surface-100 border border-white/6 rounded-3xl p-6
                     shadow-card ${className}`}>
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-8 h-8 rounded-xl bg-navy-500/15 flex items-center justify-center">
          <Icon size={15} className="text-navy-400" />
        </div>
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Read-only field ───────────────────────────────────────────────────────────
function ReadField({ label, value }) {
  return (
    <div>
      <label className="font-body text-2xs text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <p className="font-body text-sm text-white">{value || '—'}</p>
    </div>
  );
}

// ── Editable input ────────────────────────────────────────────────────────────
function EditField({ label, value, onChange, type = 'text', placeholder, error }) {
  return (
    <div>
      <label className="font-body text-2xs text-slate-500 uppercase tracking-widest block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl bg-surface-200 border
                    font-body text-sm text-white placeholder-slate-600
                    focus:outline-none focus:ring-1 transition-all
                    ${error
                      ? 'border-red-500/60 focus:ring-red-500/30'
                      : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
                    }`}
      />
      {error && <p className="mt-1 font-body text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function Profile() {
  const user       = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // ── Profile edit state ───────────────────────────────────────────────────
  const [editing, setEditing]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [profile, setProfile]   = useState({
    firstName:  user?.firstName  ?? '',
    lastName:   user?.lastName   ?? '',
    email:      user?.email      ?? '',
    university: user?.university ?? '',
    role:       user?.role       ?? 'Undergraduate',
    bio:        user?.bio        ?? '',
  });
  const [pErrors, setPErrors]   = useState({});

  // ── Password state ───────────────────────────────────────────────────────
  const [changingPw, setChangingPw] = useState(false);
  const [pwForm, setPwForm]         = useState({ current: '', next: '', confirm: '' });
  const [pwShow, setPwShow]         = useState({ current: false, next: false, confirm: false });
  const [pwErrors, setPwErrors]     = useState({});
  const [savingPw,  setSavingPw]    = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const avatarInitials =
    `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  function setP(key) {
    return (e) => {
      setProfile((f) => ({ ...f, [key]: e.target.value }));
      setPErrors((er) => ({ ...er, [key]: '' }));
    };
  }

  function validateProfile() {
    const e = {};
    if (!profile.firstName.trim()) e.firstName = 'Required.';
    if (!profile.lastName.trim())  e.lastName  = 'Required.';
    if (!profile.email.trim() || !/\S+@\S+\.\S+/.test(profile.email))
      e.email = 'Valid email required.';
    return e;
  }

  async function handleSaveProfile() {
    const errs = validateProfile();
    if (Object.keys(errs).length) { setPErrors(errs); return; }
    setSaving(true);
    try {
      // Replace with actual API call: await authService.updateProfile(profile)
      await new Promise((r) => setTimeout(r, 900)); // mock
      updateUser(profile);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    const errs = {};
    if (!pwForm.current)              errs.current  = 'Enter current password.';
    if (!pwForm.next || pwForm.next.length < 8) errs.next = 'Min. 8 characters.';
    if (pwForm.next !== pwForm.confirm)          errs.confirm = 'Passwords do not match.';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setSavingPw(true);
    try {
      await new Promise((r) => setTimeout(r, 900)); // mock
      toast.success('Password changed!');
      setChangingPw(false);
      setPwForm({ current: '', next: '', confirm: '' });
    } catch {
      toast.error('Failed to change password.');
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
        <p className="font-body text-sm text-slate-400 mt-1">
          Manage your personal information and account security.
        </p>
      </motion.div>

      {/* ── Avatar + quick info ─────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.06)}
        className="bg-surface-100 border border-white/6 rounded-3xl p-6
                   shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-6"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-800
                          flex items-center justify-center shadow-glow-navy/30
                          font-display text-white text-3xl font-bold">
            {avatarInitials}
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                            bg-success ring-2 ring-surface-100" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl font-bold text-white">
            {profile.firstName} {profile.lastName}
          </p>
          <p className="font-body text-sm text-slate-400 mt-0.5">{profile.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-body text-2xs text-navy-300 bg-navy-500/15
                             border border-navy-500/30 rounded-full px-2.5 py-0.5">
              {profile.role}
            </span>
            {profile.university && (
              <span className="font-body text-2xs text-slate-400">
                · {profile.university}
              </span>
            )}
          </div>
        </div>

        {/* Edit / Save / Cancel */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {editing ? (
            <>
              <button
                onClick={() => { setEditing(false); setPErrors({}); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl
                           border border-white/10 text-slate-400 hover:text-white
                           hover:bg-white/5 font-body text-sm transition-colors"
              >
                <RiCloseLine size={15} /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                           bg-navy-600 hover:bg-navy-500 text-white
                           font-body text-sm font-semibold transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? <Loading variant="button" label="Saving…" />
                  : <><RiSaveLine size={15} /> Save</>
                }
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                         border border-navy-500/40 bg-navy-500/10 text-navy-300
                         hover:bg-navy-500/20 hover:text-white
                         font-body text-sm transition-colors"
            >
              <RiEditLine size={15} /> Edit profile
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Personal info card ──────────────────────────────────── */}
      <motion.div {...fadeUp(0.1)}>
        <Card title="Personal Information" icon={RiUserLine}>
          {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditField label="First name"   value={profile.firstName}  onChange={setP('firstName')}  error={pErrors.firstName} />
              <EditField label="Last name"    value={profile.lastName}   onChange={setP('lastName')}   error={pErrors.lastName} />
              <EditField label="Email"        value={profile.email}      onChange={setP('email')}      type="email" error={pErrors.email} className="sm:col-span-2" />
              <EditField label="University"   value={profile.university} onChange={setP('university')} placeholder="e.g. MIT, IIT Bombay" />
              <div>
                <label className="font-body text-2xs text-slate-500 uppercase tracking-widest block mb-1.5">
                  Role
                </label>
                <select
                  value={profile.role}
                  onChange={setP('role')}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200
                             border border-white/10 font-body text-sm text-white
                             focus:outline-none focus:border-navy-500/60 focus:ring-1
                             focus:ring-navy-500/30 transition-all appearance-none cursor-pointer"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-surface-200">{r}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="font-body text-2xs text-slate-500 uppercase tracking-widest block mb-1.5">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={setP('bio')}
                  rows={3}
                  placeholder="Tell us a bit about yourself…"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-200 border
                             border-white/10 font-body text-sm text-white placeholder-slate-600
                             focus:outline-none focus:border-navy-500/60 focus:ring-1
                             focus:ring-navy-500/30 transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ReadField label="First name"   value={profile.firstName} />
              <ReadField label="Last name"    value={profile.lastName} />
              <ReadField label="Email"        value={profile.email} />
              <ReadField label="University"   value={profile.university} />
              <ReadField label="Role"         value={profile.role} />
              {profile.bio && (
                <div className="sm:col-span-2">
                  <ReadField label="Bio" value={profile.bio} />
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Security card ───────────────────────────────────────── */}
      <motion.div {...fadeUp(0.15)}>
        <Card title="Security" icon={RiShieldCheckLine}>
          {!changingPw ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-white">Password</p>
                <p className="font-body text-xs text-slate-500 mt-0.5">
                  Last changed: never (set during registration)
                </p>
              </div>
              <button
                onClick={() => setChangingPw(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                           border border-white/10 text-slate-300 hover:text-white
                           hover:bg-white/5 font-body text-sm transition-colors"
              >
                <RiLockPasswordLine size={14} />
                Change password
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} noValidate className="space-y-4 max-w-sm">
              {(['current', 'next', 'confirm']).map((key) => {
                const labels = { current: 'Current password', next: 'New password', confirm: 'Confirm new password' };
                return (
                  <div key={key}>
                    <label className="font-body text-2xs text-slate-500 uppercase tracking-widest block mb-1.5">
                      {labels[key]}
                    </label>
                    <div className="relative">
                      <input
                        type={pwShow[key] ? 'text' : 'password'}
                        value={pwForm[key]}
                        onChange={(e) => {
                          setPwForm((f) => ({ ...f, [key]: e.target.value }));
                          setPwErrors((er) => ({ ...er, [key]: '' }));
                        }}
                        className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-surface-200 border
                                    font-body text-sm text-white placeholder-slate-600
                                    focus:outline-none focus:ring-1 transition-all
                                    ${pwErrors[key]
                                      ? 'border-red-500/60 focus:ring-red-500/30'
                                      : 'border-white/10 focus:border-navy-500/60 focus:ring-navy-500/30'
                                    }`}
                      />
                      <button
                        type="button"
                        onClick={() => setPwShow((s) => ({ ...s, [key]: !s[key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                                   text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {pwShow[key] ? <RiEyeOffLine size={14} /> : <RiEyeLine size={14} />}
                      </button>
                    </div>
                    {pwErrors[key] && (
                      <p className="mt-1 font-body text-xs text-red-400">{pwErrors[key]}</p>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingPw}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                             bg-navy-600 hover:bg-navy-500 text-white
                             font-body text-sm font-semibold transition-colors
                             disabled:opacity-50"
                >
                  {savingPw ? <Loading variant="button" label="Saving…" /> : 'Update password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setChangingPw(false); setPwErrors({}); }}
                  className="px-4 py-2 rounded-xl border border-white/10
                             text-slate-400 hover:text-white hover:bg-white/5
                             font-body text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Card>
      </motion.div>

      {/* ── Danger zone ─────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.2)}>
        <div className="bg-surface-100 border border-red-500/15 rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
              <RiDeleteBinLine size={15} className="text-red-400" />
            </div>
            <h3 className="font-display text-base font-semibold text-red-400">Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-body text-sm text-white">Delete account</p>
              <p className="font-body text-xs text-slate-500 mt-0.5">
                Permanently removes your account, chats, and all uploaded documents.
              </p>
            </div>
            <button
              onClick={() => toast.error('Account deletion requires email confirmation.')}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl
                         border border-red-500/30 text-red-400 hover:bg-red-500/10
                         hover:text-red-300 font-body text-sm transition-colors"
            >
              <RiDeleteBinLine size={14} /> Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
