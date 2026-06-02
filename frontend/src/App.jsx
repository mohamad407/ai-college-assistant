import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuthStore } from '@store/authStore';
import PageWrapper  from '@components/layout/PageWrapper';
import Spinner      from '@components/common/Spinner';

// ─── Lazy pages ──────────────────────────────────────────────────────────────
const Home      = lazy(() => import('@pages/Home'));
const Dashboard = lazy(() => import('@pages/Dashboard'));
const Chat      = lazy(() => import('@pages/Chat'));
const Documents = lazy(() => import('@pages/Documents'));
const Profile   = lazy(() => import('@pages/Profile'));
const Settings  = lazy(() => import('@pages/Settings'));
const Login     = lazy(() => import('@pages/Login'));
const Register  = lazy(() => import('@pages/Register'));
const NotFound  = lazy(() => import('@pages/NotFound'));

// ─── Route guards ────────────────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

// ─── Full-screen loader ───────────────────────────────────────────────────────
function SuspenseFallback() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="w-16 h-16 rounded-full border border-navy-600/40
                          animate-ping absolute inset-0" />
          {/* Logo mark */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-800
                          flex items-center justify-center shadow-glow-navy relative z-10">
            <span className="font-display text-white text-2xl font-bold">A</span>
          </div>
        </div>
        <p className="font-body text-sm text-slate-500 tracking-widest uppercase">
          Loading…
        </p>
      </div>
    </div>
  );
}

// ─── Page transition wrapper ─────────────────────────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2,  ease: 'easeIn' } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const location          = useLocation();
  const initAuth          = useAuthStore((s) => s.initAuth);
  const isHydrated        = useAuthStore((s) => s.isHydrated);

  // Rehydrate auth from localStorage / token on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Don't render routes until auth state is resolved
  if (!isHydrated) return <SuspenseFallback />;

  return (
    <Suspense fallback={<SuspenseFallback />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

          {/* ── Public routes ─────────────────────────────────────────── */}
          <Route
            path="/"
            element={
              <AnimatedPage>
                <Home />
              </AnimatedPage>
            }
          />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <AnimatedPage>
                  <Login />
                </AnimatedPage>
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <AnimatedPage>
                  <Register />
                </AnimatedPage>
              </GuestRoute>
            }
          />

          {/* ── Protected routes (inside shell layout) ────────────────── */}
          <Route
            element={
              <ProtectedRoute>
                <PageWrapper />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <AnimatedPage>
                  <Dashboard />
                </AnimatedPage>
              }
            />

            <Route
              path="/chat"
              element={
                <AnimatedPage>
                  <Chat />
                </AnimatedPage>
              }
            />

            <Route
              path="/chat/:sessionId"
              element={
                <AnimatedPage>
                  <Chat />
                </AnimatedPage>
              }
            />

            <Route
              path="/documents"
              element={
                <AnimatedPage>
                  <Documents />
                </AnimatedPage>
              }
            />

            <Route
              path="/profile"
              element={
                <AnimatedPage>
                  <Profile />
                </AnimatedPage>
              }
            />

            <Route
              path="/settings"
              element={
                <AnimatedPage>
                  <Settings />
                </AnimatedPage>
              }
            />
          </Route>

          {/* ── Catch-all ─────────────────────────────────────────────── */}
          <Route
            path="*"
            element={
              <AnimatedPage>
                <NotFound />
              </AnimatedPage>
            }
          />

        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
