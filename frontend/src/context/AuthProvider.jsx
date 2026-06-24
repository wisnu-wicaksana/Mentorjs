import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext.js';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Cek sesi login saat aplikasi pertama kali dimuat
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await authAPI.getMe();
        if (isMounted && response.status === 'success' && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fungsi Login
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.status === 'success') {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal masuk. Silakan periksa kembali email & password Anda.';
      return { success: false, message: msg };
    }
  };

  // 3. Fungsi Registrasi
  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);
      if (response.status === 'success') {
        setUser(response.data);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Gagal mendaftar. Data tidak valid atau sudah digunakan.';
      return { success: false, message: msg };
    }
  };

  // 4. Fungsi Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error saat proses logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
