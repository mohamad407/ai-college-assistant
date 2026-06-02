import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App.jsx';
import './index.css';

// ─── Global error boundary (dev-friendly) ───────────────────────────────────
class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[RootErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-0 flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <h1 className="font-display text-2xl text-white">Something went wrong</h1>
            <p className="text-slate-400 font-body text-sm">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-navy-600 hover:bg-navy-500 text-white rounded-xl
                         font-body text-sm transition-colors duration-200"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Toast configuration ─────────────────────────────────────────────────────
const toastOptions = {
  duration: 4000,
  style: {
    background: '#1d2235',
    color: '#e2e8f0',
    border: '1px solid rgba(58, 91, 242, 0.3)',
    borderRadius: '12px',
    fontFamily: '"DM Sans", sans-serif',
    fontSize: '0.875rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
  success: {
    iconTheme: { primary: '#22c55e', secondary: '#1d2235' },
  },
  error: {
    iconTheme: { primary: '#ef4444', secondary: '#1d2235' },
  },
  loading: {
    iconTheme: { primary: '#3a5bf2', secondary: '#1d2235' },
  },
};

// ─── Mount ───────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={toastOptions}
        />
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>
);
