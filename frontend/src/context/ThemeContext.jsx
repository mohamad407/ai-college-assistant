import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'academiq_theme';

/** @type {'dark' | 'light' | 'system'} */
const THEMES = { DARK: 'dark', LIGHT: 'light', SYSTEM: 'system' };

const ACTIONS = {
  SET_THEME:     'SET_THEME',
  TOGGLE_THEME:  'TOGGLE_THEME',
  SET_RESOLVED:  'SET_RESOLVED',   // resolved = actual 'dark'|'light' after system check
};

// ─────────────────────────────────────────────────────────────────────────────
// CSS custom properties for each theme
// Applied to :root so Tailwind's `dark:` classes AND raw CSS vars both work.
// ─────────────────────────────────────────────────────────────────────────────
const CSS_VARS = {
  dark: {
    '--color-bg-base':      '#0a0c14',
    '--color-bg-surface':   '#0f1220',
    '--color-bg-elevated':  '#1d2235',
    '--color-text-primary': '#f1f5f9',
    '--color-text-muted':   '#64748b',
    '--color-border':       'rgba(255,255,255,0.07)',
    '--color-accent':       '#3a5bf2',
    '--color-accent-light': '#6082f7',
    '--color-amber':        '#fbbf24',
    '--shadow-card':        '0 4px 24px 0 rgba(0,0,0,0.5)',
  },
  light: {
    '--color-bg-base':      '#f8fafc',
    '--color-bg-surface':   '#ffffff',
    '--color-bg-elevated':  '#f1f5f9',
    '--color-text-primary': '#0f172a',
    '--color-text-muted':   '#64748b',
    '--color-border':       'rgba(0,0,0,0.08)',
    '--color-accent':       '#2338e6',
    '--color-accent-light': '#3a5bf2',
    '--color-amber':        '#d97706',
    '--shadow-card':        '0 4px 24px 0 rgba(0,0,0,0.08)',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Read the saved theme preference from localStorage. */
function readStoredTheme() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && Object.values(THEMES).includes(raw)) return raw;
  } catch { /* ignore */ }
  return THEMES.SYSTEM; // sensible default
}

/** Write theme preference to localStorage. */
function writeStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch { /* ignore */ }
}

/**
 * Determine the true rendered theme when preference is 'system'.
 * Falls back to 'dark' if matchMedia isn't available (SSR guard).
 */
function resolveSystemTheme() {
  if (typeof window === 'undefined') return THEMES.DARK;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
}

/** Resolve a preference ('dark' | 'light' | 'system') → 'dark' | 'light'. */
function resolveTheme(preference) {
  if (preference === THEMES.SYSTEM) return resolveSystemTheme();
  return preference;
}

/**
 * Apply CSS vars + Tailwind `dark` class to <html> element.
 * Called whenever the resolved theme changes.
 */
function applyThemeToDOM(resolved) {
  const root = document.documentElement;

  // Tailwind dark mode class strategy
  root.classList.remove('dark', 'light');
  root.classList.add(resolved);

  // Inject CSS custom properties
  const vars = CSS_VARS[resolved] ?? CSS_VARS.dark;
  Object.entries(vars).forEach(([key, val]) => {
    root.style.setProperty(key, val);
  });

  // Update <meta name="color-scheme"> for native browser chrome
  let meta = document.querySelector('meta[name="color-scheme"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'color-scheme';
    document.head.appendChild(meta);
  }
  meta.content = resolved;
}

// ─────────────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialState() {
  const preference = readStoredTheme();
  const resolved   = resolveTheme(preference);
  return {
    /** User's saved preference: 'dark' | 'light' | 'system' */
    preference,
    /** Actual rendered theme after system resolution: 'dark' | 'light' */
    resolved,
    isDark:  resolved === THEMES.DARK,
    isLight: resolved === THEMES.LIGHT,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
function themeReducer(state, action) {
  switch (action.type) {

    case ACTIONS.SET_THEME: {
      const preference = action.payload;
      const resolved   = resolveTheme(preference);
      return {
        ...state,
        preference,
        resolved,
        isDark:  resolved === THEMES.DARK,
        isLight: resolved === THEMES.LIGHT,
      };
    }

    case ACTIONS.TOGGLE_THEME: {
      // Cycle: dark → light → dark (ignores 'system' after first manual toggle)
      const next       = state.resolved === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
      return {
        ...state,
        preference: next,
        resolved:   next,
        isDark:     next === THEMES.DARK,
        isLight:    next === THEMES.LIGHT,
      };
    }

    case ACTIONS.SET_RESOLVED: {
      const resolved = action.payload;
      return {
        ...state,
        resolved,
        isDark:  resolved === THEMES.DARK,
        isLight: resolved === THEMES.LIGHT,
      };
    }

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, undefined, buildInitialState);

  // ── Apply CSS vars + class to DOM whenever resolved theme changes ─────
  useEffect(() => {
    applyThemeToDOM(state.resolved);
  }, [state.resolved]);

  // ── Listen for OS-level theme changes (only relevant when pref=system) ─
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql     = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      if (state.preference === THEMES.SYSTEM) {
        const resolved = e.matches ? THEMES.DARK : THEMES.LIGHT;
        dispatch({ type: ACTIONS.SET_RESOLVED, payload: resolved });
      }
    };

    // Modern API
    if (mql.addEventListener) {
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
    // Legacy Safari
    mql.addListener(handler);
    return () => mql.removeListener(handler);
  }, [state.preference]);

  // ─────────────────────────────────────────────────────────────────────
  // setTheme(preference: 'dark' | 'light' | 'system')
  // ─────────────────────────────────────────────────────────────────────
  const setTheme = useCallback((preference) => {
    if (!Object.values(THEMES).includes(preference)) {
      console.warn(`[ThemeContext] Invalid theme: "${preference}". Use 'dark', 'light', or 'system'.`);
      return;
    }
    writeStoredTheme(preference);
    dispatch({ type: ACTIONS.SET_THEME, payload: preference });
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // toggleTheme() — flips between dark ↔ light
  // ─────────────────────────────────────────────────────────────────────
  const toggleTheme = useCallback(() => {
    const next = state.resolved === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    writeStoredTheme(next);
    dispatch({ type: ACTIONS.TOGGLE_THEME });
  }, [state.resolved]);

  // ─────────────────────────────────────────────────────────────────────
  // Memoised value
  // ─────────────────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    // ── State ────────────────────────────────────────────────────────
    /** User preference: 'dark' | 'light' | 'system' */
    preference: state.preference,
    /** Resolved actual theme: 'dark' | 'light' */
    theme:      state.resolved,
    isDark:     state.isDark,
    isLight:    state.isLight,

    // ── Constants (expose for consumers that need string matching) ────
    THEMES,

    // ── Actions ───────────────────────────────────────────────────────
    /** Set a specific preference */
    setTheme,
    /** Toggle dark ↔ light */
    toggleTheme,
    /** Convenience aliases */
    setDark:   () => setTheme(THEMES.DARK),
    setLight:  () => setTheme(THEMES.LIGHT),
    setSystem: () => setTheme(THEMES.SYSTEM),
  }), [
    state.preference, state.resolved, state.isDark, state.isLight,
    setTheme, toggleTheme,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useTheme()
 *
 * Returns the full theme context.
 * Must be used inside <ThemeProvider>.
 *
 * @example
 *   const { isDark, toggleTheme, setTheme, THEMES } = useTheme();
 *
 * @example  — three-way selector
 *   <button onClick={() => setTheme(THEMES.SYSTEM)}>Follow system</button>
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      '[useTheme] must be used within a <ThemeProvider>.\n' +
      'Wrap your app: <ThemeProvider><App /></ThemeProvider>'
    );
  }
  return ctx;
}

export default ThemeContext;
