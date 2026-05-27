import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((fresh) => {
        setUser(fresh);
        localStorage.setItem('user', JSON.stringify(fresh));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = useCallback(({ user: u, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials);
      persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const signup = useCallback(
    async (payload) => {
      const data = await authApi.signup(payload);
      persistSession(data);
      return data.user;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, signup, logout }),
    [user, loading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
