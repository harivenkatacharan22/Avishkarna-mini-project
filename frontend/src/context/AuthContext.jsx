import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load User details
  const loadUser = async (userToken) => {
    const activeToken = userToken || token;
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
      const res = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to load user session:', err.response?.data || err.message);
      // If token is invalid or expired, clear auth details
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  // Login User
  const login = async (username, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });
      const { token: newToken, user: newUser } = res.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Register User
  const register = async (name, username, password, phone, village) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        username,
        password,
        phone,
        village
      });
      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, error: errMsg };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loadUser
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
