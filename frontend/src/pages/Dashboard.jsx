import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiChat3Line,
  RiFileTextLine,
  RiFlashlightLine,
  RiTimeLine,
  RiArrowRightLine,
  RiSparklingLine,
  RiBookOpenLine,
  RiQuestionLine,
  RiBrainLine,
  RiTrophyLine,
} from 'react-icons/ri';
import { useAuthStore } from '@store/authStore';

// ── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
});

// ── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  { icon: RiChat3Line,    label: 'Chat Sessions',   value: '24',   delta: '+3 today',    color: 'text-navy-400',  bg: 'bg-navy-500/15' },
  { icon: RiFileTextLine, label: 'Documents',        value: '12',   delta: '3 indexed',   color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { icon: RiBrainLine,    label: 'Questions Asked',  value: '187',  delta: '+12 this week',color: 'text-teal-400',  bg: 'bg-teal-500/15' },
  { icon: RiTrophyLine,   label: 'Topics Mastered',  value: '8',    delta: 'Keep going!', color: 'text-rose-400',  bg: 'bg-rose-500/15' },
];

const RECENT_CHATS = [
  { id: '1', title: 'Binary Search Tree Explained', subject: 'Data Structures', time: '2h ago', messages: 14 },
  { id: '2', title: 'Calculus Integration by Parts', subject: 'Mathematics',     time: '5h ago', messages: 9 },
  { id: '3', title: 'Photosynthesis Deep Dive',      subject: 'Biology',         time: '1d ago', messages: 22 },
];

const QUICK_ACTIONS = [
  {
    icon: RiSparklingLine,
    label: 'Ask AI a question',
    desc: 'Get instant explanations on any topic',
    to: '/chat',
    accent: 'from-navy-600/40 to-navy-800/40 hover:from-navy-600/60 border-navy-500/30 hover:border-navy-400/50',
    iconBg: 'bg-navy-500/20 text-navy-300',
  },
  {
    icon: RiFileTextLine,
    label: 'Upload documents',
    desc: 'Index your notes, slides, and PDFs',
    to: '/documents',
    accent: 'from-amber-600/20 to-amber-900/20 hover:from-amber-600/30 border-amber-500/20 hover:border-amber-400/40',
    iconBg: 'bg-amber-500/20 text-amber-300',
  },
  {
    icon: RiBookOpenLine,
    label: 'Study flashcards',
    desc: 'AI-generated cards from your materials',
    to: '/chat?mode=flashcard',
    accent: 'from-teal-600/20 to-teal-900/20 hover:from-teal-600/30 border-teal-500/20 hover:border-teal-400/40',
    iconBg: 'bg-teal-500/20 text-teal-300',
  },
  {
    icon: RiQuestionLine,
    label: 'Mock exam',
    desc: 'Practice with AI-generated questions',
    to: '/chat?mode=exam',
    accent: 'from-rose-600/20 to-rose-900/20 hover:from-rose-600/30 border-rose-500/20 hover:border-rose-400/40',
    iconBg: 'bg-rose-500/20 text-rose-300',
  },
];

// ── Subject spotlight (suggested topics) ─────────────────────────────────────
const SUGGESTED = [
  'Explain Big-O notation', 'Summarize my uploaded notes', 'Quiz me on thermodynamics',
  'Explain neural networks simply', 'Help with essay structure', 'Solve this integral',
];

// ── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user     = useAuthStore((s) => s.user);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* ── Hero greeting ──────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-navy-900/80 via-surface-200 to-surface-300
        border border-navy-700/40 p-8">
        {/* Background decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 -translate-y-1/3 translate-x-1/3
                        rounded-full bg-navy-600/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 w-48 h-48 translate-y-1/2
                        rounded-full bg-amber-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start
                        sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm text-navy-300 uppercase tracking-widest mb-1">
              {getGreeting()} ✦
            </p>
            <h1 className="font-display text-3xl font-bold text-white leading-tight">
              {user?.firstName ?? 'Student'},<br className="sm:hidden" /> ready to learn?
            </h1>
            <p className="font-body text-sm text-slate-400 mt-2 max-w-sm">
              Your AI assistant is loaded with your course materials and ready to help.
            </p>
          </div>

          <Link
            to="/chat"
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl
                       bg-navy-600 hover:bg-navy-500
                       text-white font-body font-semibold text-sm
                       shadow-glow-navy/30 hover:shadow-glow-navy
                       transition-all duration-200 flex-shrink-0"
          >
            <RiFlashlightLine size={16} />
            Start a session
            <RiArrowRightLine size={14} />
          </Link>
        </div>
      </motion.div>

      {/* ── Stats row ──────────────────────────────────────────── */}
      <motion.div
        {...fadeUp(0.08)}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STATS.map(({ icon: Icon, label, value, delta, color, bg }) => (
          <div
            key={label}
            className="bg-surface-100 border border-white/6 rounded-2xl p-5
                       hover:border-white/12 transition-all duration-200 shadow-card group"
          >
            <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-4`}>
              <Icon size={17} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-white">{value}</p>
            <p className="font-body text-xs text-slate-400 mt-0.5">{label}</p>
            <p className="font-body text-2xs text-slate-600 mt-2">{delta}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Quick actions ──────────────────────────────────────── */}
      <motion.section {...fadeUp(0.15)}>
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, to, accent, iconBg }) => (
            <Link
              key={to}
              to={to}
              className={`group flex flex-col gap-3 p-5 rounded-2xl border
                          bg-gradient-to-br ${accent}
                          transition-all duration-200 hover:shadow-card`}
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center
                               group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-white">{label}</p>
                <p className="font-body text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <RiArrowRightLine
                size={14}
                className="text-slate-500 group-hover:text-white
                           group-hover:translate-x-1 transition-all mt-auto"
              />
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── Bottom row: recent chats + suggested prompts ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent chats */}
        <motion.section {...fadeUp(0.2)} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              Recent Chats
            </h2>
            <Link
              to="/chat"
              className="font-body text-xs text-navy-400 hover:text-navy-300
                         flex items-center gap-1 transition-colors"
            >
              View all <RiArrowRightLine size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_CHATS.map(({ id, title, subject, time, messages }) => (
              <Link
                key={id}
                to={`/chat/${id}`}
                className="group flex items-start gap-4 p-4 rounded-2xl
                           bg-surface-100 border border-white/6
                           hover:border-navy-500/30 hover:bg-surface-200
                           transition-all duration-200 shadow-card"
              >
                <div className="w-9 h-9 rounded-xl bg-navy-500/15 flex items-center
                                justify-center flex-shrink-0 mt-0.5">
                  <RiChat3Line size={15} className="text-navy-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold text-white truncate
                                group-hover:text-navy-300 transition-colors">
                    {title}
                  </p>
                  <p className="font-body text-xs text-slate-500 mt-0.5">{subject}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="font-body text-2xs text-slate-600 flex items-center gap-1">
                    <RiTimeLine size={10} /> {time}
                  </span>
                  <span className="font-body text-2xs text-slate-600">
                    {messages} msgs
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Suggested prompts */}
        <motion.section {...fadeUp(0.25)} className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            Try Asking…
          </h2>
          <div className="space-y-2.5">
            {SUGGESTED.map((prompt) => (
              <button
                key={prompt}
                onClick={() => navigate(`/chat?q=${encodeURIComponent(prompt)}`)}
                className="w-full text-left flex items-center gap-3 px-4 py-3
                           rounded-xl bg-surface-100 border border-white/6
                           hover:border-navy-500/30 hover:bg-surface-200
                           transition-all duration-200 group"
              >
                <RiSparklingLine
                  size={13}
                  className="text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0"
                />
                <span className="font-body text-xs text-slate-300 group-hover:text-white
                                  transition-colors leading-snug">
                  {prompt}
                </span>
              </button>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
