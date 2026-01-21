import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/user');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    // Clear any old data first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    const response = await api.post('/login', { email, password });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  const register = async (name, email, password, password_confirmation) => {
    // Clear any old data first
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
      role: 'citizen',
    });
    const { token, user: userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    
    return userData;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Ignore error
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role && ['admin', 'finance_officer', 'urban_planner', 'hr_manager', 'clerk'].includes(user.role);
  const isCitizen = user?.role === 'citizen';

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      loading,
      isAuthenticated,
      isAdmin,
      isCitizen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}