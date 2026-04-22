import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser, logoutUser } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('lms-auth-user');
    return stored || null;
  });

  const isAuthenticated = Boolean(user);

  async function login(identity, password) {
    const result = await loginUser({ identity, password });
    if (result.success) {
      setUser(identity);
      localStorage.setItem('lms-auth-user', identity);
    }
    return result;
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    localStorage.removeItem('lms-auth-user');
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
