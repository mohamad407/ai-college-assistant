import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const AUTH_STORAGE_KEY = 'academiq_auth';

const ACTIONS = {
  HYDRATE:        'HYDRATE',
  LOGIN_START:    'LOGIN_START',
  LOGIN_SUCCESS:  'LOGIN_SUCCESS',
  LOGIN_ERROR:    'LOGIN_ERROR',
  LOGOUT:         'LOGOUT',
  UPDATE_USER:    'UPDATE_USER',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS:'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  CLEAR_ERROR:    'CLEAR_ERROR',
};

// ─────────────────────────────────────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────────────────────────────────────
const initialState = {
  user:            null,   // { id, firstName, lastName, email, role, university, bio }
  token:           null,   // JWT string
  isAuthenticated: false,
  isLoading:       false,  // true during login / register network calls
  isHydrated:      false,  // true once localStorage has been read
  error:           null,   // last auth error message | null
};

// ─────────────────────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────────────────────
function authReducer(state, action) {
  switch (action.type) {

    case ACTIONS.HYDRATE:
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: !!action.payload.token && !!action.payload.user,
        isHydrated:      true,
      };

    case ACTIONS.LOGIN_START:
    case ACTIONS.REGISTER_START:
      return { ...state, isLoading: true, error: null };

    case ACTIONS.LOGIN_SUCCESS:
    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user:            action.payload.user,
        token:           action.payload.token,
        isAuthenticated: true,
        isLoading:       false,
        error:           null,
      };

    case ACTIONS.LOGIN_ERROR:
    case ACTIONS.REGISTER_ERROR:
      return {
        ...state,
        isLoading: false,
        error:     action.payload.message,
      };

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case ACTIONS.LOGOUT:
      return {
        ...initialState,
        isHydrated: true, // keep flag so app doesn't flash loader again
      };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers
// ─────────────────────────────────────────────────────────────────────────────
function persistAuth(user, token) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user, token })
    );
  } catch (err) {
    console.warn('[AuthContext] Could not persist auth to localStorage:', err);
  }
}

function clearPersistedAuth() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (err) {
    console.warn('[AuthContext] Could not clear auth from localStorage:', err);
  }
}

function readPersistedAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, token: null };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — automatically attaches Bearer token from localStorage
// so components don't need to thread the token manually.
// ─────────────────────────────────────────────────────────────────────────────
export const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: inject token
authAxios.interceptors.request.use((config) => {
  const { token } = readPersistedAuth();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── Hydrate from localStorage on first mount ──────────────────────────
  useEffect(() => {
    const { user, token } = readPersistedAuth();
    dispatch({ type: ACTIONS.HYDRATE, payload: { user, token } });
  }, []);

  // ── Sync axios default header whenever token changes ──────────────────
  useEffect(() => {
    if (state.token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete authAxios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // ─────────────────────────────────────────────────────────────────────
  // login(email, password) → throws on failure
  // ─────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      /*
       * PRODUCTION: swap the mock block below for:
       *   const { data } = await authAxios.post('/auth/login', { email, password });
       *   const { user, token } = data;
       */

      // ── Mock (remove when backend is ready) ──────────────────────────
      await new Promise((r) => setTimeout(r, 750));
      if (password.length < 4) throw new Error('Invalid credentials.');
      const user = {
        id:         'usr_' + Date.now(),
        firstName:  'Ada',
        lastName:   'Lovelace',
        email,
        role:       'Undergraduate',
        university: 'University of Cambridge',
        bio:        '',
      };
      const token = 'mock_jwt_' + Date.now();
      // ── End mock ─────────────────────────────────────────────────────

      persistAuth(user, token);
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { user, token } });
      return { user, token };
    } catch (err) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Login failed.';
      dispatch({ type: ACTIONS.LOGIN_ERROR, payload: { message } });
      throw new Error(message);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // register(payload) → throws on failure
  // ─────────────────────────────────────────────────────────────────────
  const register = useCallback(async (payload) => {
    dispatch({ type: ACTIONS.REGISTER_START });
    try {
      /*
       * PRODUCTION: swap for:
       *   const { data } = await authAxios.post('/auth/register', payload);
       *   const { user, token } = data;
       */

      // ── Mock ─────────────────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 900));
      const user  = { id: 'usr_' + Date.now(), ...payload };
      const token = 'mock_jwt_' + Date.now();
      // ── End mock ─────────────────────────────────────────────────────

      persistAuth(user, token);
      dispatch({ type: ACTIONS.REGISTER_SUCCESS, payload: { user, token } });
      return { user, token };
    } catch (err) {
      const message =
        err?.response?.data?.message ?? err?.message ?? 'Registration failed.';
      dispatch({ type: ACTIONS.REGISTER_ERROR, payload: { message } });
      throw new Error(message);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // logout()
  // ─────────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      // PRODUCTION: optionally call → await authAxios.post('/auth/logout');
    } catch {
      // Swallow server errors — always clear client state
    } finally {
      clearPersistedAuth();
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // updateUser(fields) — partial update of user profile in state + storage
  // ─────────────────────────────────────────────────────────────────────
  const updateUser = useCallback((fields) => {
    dispatch({ type: ACTIONS.UPDATE_USER, payload: fields });
    // Merge into persisted storage
    const { token } = readPersistedAuth();
    const updatedUser = { ...(state.user ?? {}), ...fields };
    persistAuth(updatedUser, token);
  }, [state.user]);

  // ─────────────────────────────────────────────────────────────────────
  // clearError()
  // ─────────────────────────────────────────────────────────────────────
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // ─────────────────────────────────────────────────────────────────────
  // Memoised context value — only re-renders consumers when state changes
  // ─────────────────────────────────────────────────────────────────────
  const value = useMemo(() => ({
    // ── State ────────────────────────────────────────────────────────
    user:            state.user,
    token:           state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading:       state.isLoading,
    isHydrated:      state.isHydrated,
    error:           state.error,

    // ── Derived helpers ───────────────────────────────────────────────
    /** Full display name, e.g. "Ada Lovelace" */
    displayName: state.user
      ? `${state.user.firstName ?? ''} ${state.user.lastName ?? ''}`.trim()
      : null,

    /** Avatar initials, e.g. "AL" */
    initials: state.user
      ? `${state.user.firstName?.[0] ?? ''}${state.user.lastName?.[0] ?? ''}`.toUpperCase()
      : null,

    // ── Actions ───────────────────────────────────────────────────────
    login,
    logout,
    register,
    updateUser,
    clearError,
  }), [
    state.user, state.token, state.isAuthenticated,
    state.isLoading, state.isHydrated, state.error,
    login, logout, register, updateUser, clearError,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * useAuth()
 *
 * Returns the full auth context.
 * Must be used inside <AuthProvider>.
 *
 * @example
 *   const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      '[useAuth] must be used within an <AuthProvider>.\n' +
      'Wrap your app: <AuthProvider><App /></AuthProvider>'
    );
  }
  return ctx;
}

export default AuthContext;
