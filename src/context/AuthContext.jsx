'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/** Shape of the auth context value */
const AuthContext = createContext(null);

/** Persist auth session to localStorage */
const SESSION_KEYS = { token: 'token', user: 'user' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Hydrate auth state from localStorage on mount */
  useEffect(() => {
    const storedToken = localStorage.getItem(SESSION_KEYS.token);
    const storedUser = localStorage.getItem(SESSION_KEYS.user);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /** Persist token and user, then update context state */
  const login = useCallback((newToken, newUser) => {
    localStorage.setItem(SESSION_KEYS.token, newToken);
    localStorage.setItem(SESSION_KEYS.user, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  /** Clear session data and reset context state */
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEYS.token);
    localStorage.removeItem(SESSION_KEYS.user);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume AuthContext — must be used inside AuthProvider */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
