import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tb_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyExistingToken = async () => {
      const storedToken = localStorage.getItem('tb_admin_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getAdminMe();
        if (res.success && res.data) {
          setAdmin(res.data);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification error:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyExistingToken();
  }, []);

  const login = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (res.success && res.data) {
      localStorage.setItem('tb_admin_token', res.data.token);
      setToken(res.data.token);
      setAdmin(res.data.admin);
      return res.data;
    }
    throw new Error(res.error || 'Login failed');
  };

  const logout = () => {
    localStorage.removeItem('tb_admin_token');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
