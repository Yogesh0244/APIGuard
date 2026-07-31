import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('apiguard_user');
    const token = localStorage.getItem('apiguard_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    const sessionUser = { username: data.username, role: data.role };
    localStorage.setItem('apiguard_token', data.token);
    localStorage.setItem('apiguard_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    persistSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('apiguard_token');
    localStorage.removeItem('apiguard_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
