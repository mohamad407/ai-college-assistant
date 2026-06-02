import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine,
  RiChat3Line,
  RiFileTextLine,
  RiUserLine,
  RiSettings3Line,
  RiSparklingLine,
  RiGraduationCapLine,
  RiBookOpenLine,
  RiFlashlightLine,
  RiCloseLine,
} from 'react-icons/ri';

// ── Nav items ────────────────────────────────────────────────────────────────
const NAV_MAIN = [
  { to: '/dashboard', icon: RiDashboardLine,   label: 'Dashboard' },
  { to: '/chat',      icon: RiChat3Line,        label: 'AI Chat' },
  { to: '/documents', icon: RiFileTextLine,     label: 'Documents' },
];

const NAV_ACCOUNT = [
  { to: '/profile',  icon: RiUserLine,        label: 'Profile' },
  { to: '/settings', icon: RiSettings3Line,   label: 'Settings' },
];

// ── Quick-links (static tips) ────────────────────────────────────────────────
const QUICK_TIPS = [
  { icon: RiBookOpenLine,     text: 'Upload lecture slides' },
  { icon: RiFlashlightLine,   text: 'Ask about your syllabus' },
  { icon: RiGraduationCapLine,text: 'Exam prep mode' },
];

// ── Single nav link ──────────────────────────────────────────────────────────
function NavItem({ to, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
         font-body text-sm transition-all duration-200
         ${isActive
           ? 'bg-navy-600/30 text-white border border-navy-500/30 shadow-glow-navy/20'
           : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active left bar */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5
                         bg-navy-400 rounded-full"
            />
          )}

          <Icon
            size={17}
            className={`flex-shrink-0 transition-colors
              ${isActive ? 'text-navy-300' : 'text-slate-500 group-hover:text-slate-300'}`}
          />
          <span className="truncate">{label}</span>

          {/* Hover shimmer dot */}
          {!isActive && (
            <span className="ml-auto w-1 h-1 rounded-full bg-slate-600
                             group-hover:bg-navy-400 transition-colors" />
          )}
        </>
      )}
    </NavLink>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex-shrink-0 flex flex-col
          bg-surface-100 border-r border-white/5
          transition-transform duration-300 ease-spring
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Logo / Brand ─────────────────────────────────────── */}
        <div className="h-16 flex items-center justify-between px-4
                        border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-500 to-navy-800
                            flex items-center justify-center shadow-glow-navy/30">
              <RiSparklingLine className="text-white" size={16} />
            </div>
            <div>
              <p className="font-display text-white font-bold text-sm leading-none">
                AcademiQ
              </p>
              <p className="font-body text-2xs text-slate-500 leading-none mt-0.5">
                AI College Assistant
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500
                       hover:text-white hover:bg-white/5 transition-colors"
          >
            <RiCloseLine size={18} />
          </button>
        </div>

        {/* ── Scrollable nav area ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6
                        scrollbar-thin scrollbar-track-transparent
                        scrollbar-thumb-white/10">

          {/* Main nav */}
          <nav>
            <p className="font-body text-2xs text-slate-600 uppercase tracking-widest
                          px-3 mb-2">
              Main
            </p>
            <div className="space-y-1">
              {NAV_MAIN.map((item) => (
                <NavItem key={item.to} {...item} onClick={onClose} />
              ))}
            </div>
          </nav>

          {/* Quick-start tips */}
          <div>
            <p className="font-body text-2xs text-slate-600 uppercase tracking-widest
                          px-3 mb-2">
              Quick Start
            </p>
            <div className="space-y-1.5">
              {QUICK_TIPS.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl
                             text-slate-500 hover:text-slate-300
                             hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <Icon size={14} className="flex-shrink-0 group-hover:text-amber-400 transition-colors" />
                  <span className="font-body text-xs truncate">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account nav */}
          <nav>
            <p className="font-body text-2xs text-slate-600 uppercase tracking-widest
                          px-3 mb-2">
              Account
            </p>
            <div className="space-y-1">
              {NAV_ACCOUNT.map((item) => (
                <NavItem key={item.to} {...item} onClick={onClose} />
              ))}
            </div>
          </nav>
        </div>

        {/* ── AI status footer ──────────────────────────────────── */}
        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-navy-900/60 to-surface-200
                          border border-navy-700/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full
                                  rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="font-body text-2xs text-slate-300 font-semibold uppercase tracking-wider">
                Gemini 1.5 Flash — Live
              </span>
            </div>
            <p className="font-body text-2xs text-slate-500 leading-relaxed">
              RAG-powered answers from your uploaded course materials.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
