import { motion } from 'framer-motion';

/**
 * Loading / Spinner component
 *
 * Variants:
 *   "page"    – full-screen overlay (used by Suspense fallback)
 *   "section" – fills its container
 *   "inline"  – small inline indicator
 *   "button"  – tiny, fits inside a button
 */
export default function Loading({ variant = 'page', label = 'Loading…', className = '' }) {
  if (variant === 'button') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`}>
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        {label && <span className="text-sm">{label}</span>}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2 text-slate-400 font-body text-sm ${className}`}>
        <span className="w-4 h-4 border-2 border-navy-600/40 border-t-navy-400 rounded-full animate-spin" />
        {label}
      </span>
    );
  }

  // "section" & "page" share the same spinner — only wrapper differs
  const wrapperClass =
    variant === 'page'
      ? 'fixed inset-0 z-50 bg-surface-0 flex items-center justify-center'
      : `w-full h-full min-h-[200px] flex items-center justify-center ${className}`;

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-5">
        {/* Layered ring animation */}
        <div className="relative w-16 h-16">
          {/* Slow outer ping */}
          <motion.div
            className="absolute inset-0 rounded-full border border-navy-500/20"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Medium ring */}
          <motion.div
            className="absolute inset-1 rounded-full border border-navy-500/30"
            animate={{ scale: [1, 1.25], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Core logo tile */}
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-navy-600 to-navy-900
                          flex items-center justify-center shadow-glow-navy">
            <motion.span
              className="font-display text-white text-xl font-bold select-none"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              A
            </motion.span>
          </div>
        </div>

        {/* Label */}
        <motion.p
          className="font-body text-xs text-slate-500 tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.p>
      </div>
    </div>
  );
}
