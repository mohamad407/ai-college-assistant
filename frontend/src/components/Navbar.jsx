import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiSearchLine,
  RiBellLine,
  RiSettings3Line,
  RiLogoutBoxLine,
  RiUserLine,
  RiMenuLine,
  RiCloseLine,
  RiSparklingLine,
} from 'react-icons/ri';
import { useAuthStore } from '@store/authStore';
import toast from 'react-hot-toast';

// ── Notification mock ────────────────────────────────────────────────────────
const MOCK_NOTIFS = [
  { id: 1, text: 'Your document "CS101_Notes.pdf" was indexed successfully.', time: '2m ago', read: false },
  { id: 2, text: 'New AI model update available — Gemini 1.5 Flash.', time: '1h ago', read: false },
  { id: 3, text: 'Chat session "Algorithms Q&A" was saved.', time: '3h ago', read: true },
];

// ── Breadcrumb map ───────────────────────────────────────────────────────────
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/chat':      'AI Assistant',
  '/documents': 'Documents',
  '/profile':   'Profile',
  '/settings':  'Settings',
};

export default function Navbar({ onMenuToggle, sidebarOpen }) {
  const navigate          = useNavigate();
  const location          = useLocation();
  const logout            = useAuthStore((s) => s.logout);
  const user              = useAuthStore((s) => s.user);

  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchVal, setSearchVal]     = useState('');
  const [notifs, setNotifs]           = useState(MOCK_NOTIFS);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  const searchRef  = useRef(null);

  const unread = notifs.filter((n) => !n.read).length;
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'AI College Assistant';

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e) {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const markAllRead = () => setNotifs((n) => n.map((x) => ({ ...x, read: true })));

  const avatarInitials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
    : 'U';

  return (
    <header className="h-16 bg-surface-100/80 backdrop-blur-md border-b border-white/5
                        flex items-center px-4 gap-3 sticky top-0 z-40">

      {/* ── Hamburger (mobile) ─────────────────────────────────────────── */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white
                   hover:bg-white/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
      </button>

      {/* ── Page title ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-white font-semibold text-lg truncate">
          {pageTitle}
        </h2>
        <p className="font-body text-2xs text-slate-500 uppercase tracking-widest hidden sm:block">
          AI College Assistant
        </p>
      </div>

      {/* ── Search bar (expandable) ─────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            key="search-expanded"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="relative" ref={searchRef}>
              <RiSearchLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={15}
              />
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Search chats, docs…"
                className="w-full pl-9 pr-3 py-2 bg-surface-200 border border-white/10
                           rounded-xl text-sm font-body text-white placeholder-slate-500
                           focus:outline-none focus:border-navy-500/60 focus:ring-1
                           focus:ring-navy-500/30 transition-all"
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="search-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-white
                       hover:bg-white/5 transition-colors"
            aria-label="Search"
          >
            <RiSearchLine size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Notification bell ───────────────────────────────────────────── */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
          className="relative p-2 rounded-xl text-slate-400 hover:text-white
                     hover:bg-white/5 transition-colors"
          aria-label="Notifications"
        >
          <RiBellLine size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full
                             bg-amber-400 ring-2 ring-surface-100" />
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-80 bg-surface-200 border border-white/10
                         rounded-2xl shadow-card overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3
                              border-b border-white/5">
                <span className="font-body text-sm font-semibold text-white">
                  Notifications
                </span>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-2xs text-navy-400 hover:text-navy-300
                               font-body uppercase tracking-wider transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-3 transition-colors
                      ${n.read ? 'opacity-50' : 'bg-navy-900/20 hover:bg-navy-900/30'}`}
                  >
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                      ${n.read ? 'bg-slate-600' : 'bg-amber-400'}`} />
                    <div>
                      <p className="font-body text-xs text-slate-300 leading-relaxed">
                        {n.text}
                      </p>
                      <p className="font-body text-2xs text-slate-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Profile dropdown ─────────────────────────────────────────────── */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl
                     hover:bg-white/5 transition-colors group"
          aria-label="Profile menu"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-500 to-navy-700
                          flex items-center justify-center ring-1 ring-white/10
                          group-hover:ring-navy-500/50 transition-all text-white
                          font-display font-bold text-sm flex-shrink-0">
            {avatarInitials}
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-body text-xs font-semibold text-white leading-none">
              {user?.firstName ?? 'Student'}
            </p>
            <p className="font-body text-2xs text-slate-500 leading-none mt-0.5">
              {user?.role ?? 'Undergraduate'}
            </p>
          </div>
        </button>

        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-52 bg-surface-200 border border-white/10
                         rounded-2xl shadow-card overflow-hidden z-50"
            >
              {/* User info header */}
              <div className="px-4 py-3 border-b border-white/5">
                <p className="font-body text-sm text-white font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="font-body text-2xs text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>

              {[
                { icon: RiUserLine,     label: 'Profile',  to: '/profile' },
                { icon: RiSettings3Line, label: 'Settings', to: '/settings' },
              ].map(({ icon: Icon, label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-slate-300
                             hover:text-white hover:bg-white/5 transition-colors
                             font-body text-sm"
                >
                  <Icon size={15} className="text-slate-500" />
                  {label}
                </Link>
              ))}

              <div className="border-t border-white/5 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400
                             hover:text-red-300 hover:bg-red-500/10 transition-colors
                             font-body text-sm"
                >
                  <RiLogoutBoxLine size={15} />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
