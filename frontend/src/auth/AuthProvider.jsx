import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Load token on refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });

    const token = res.data.token;
    const loggedUser = res.data.user; // contains email + role

    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));

    // Save in state
    setUser(loggedUser);

    // Attach token to axios
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return loggedUser;
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete API.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
