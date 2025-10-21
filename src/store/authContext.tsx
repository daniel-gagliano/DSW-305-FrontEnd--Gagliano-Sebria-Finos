import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userId: string | null;
  userName: string | null;
  userRole: string | null;
  login: (userId: string, userName?: string, userRole?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Verificar si hay sesión al montar el componente
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('userRole');
    
    console.log('=== AuthContext useEffect ===');
    console.log('storedUserRole:', storedUserRole);
    
    if (storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
      setUserName(storedUserName);
      setUserRole(storedUserRole || 'CLIENTE');
      
      console.log('Setting userRole to:', storedUserRole || 'CLIENTE');
    }
  }, []);

  const login = (userId: string, userName?: string, userRole?: string) => {
    console.log('=== LOGIN CALLED ===');
    console.log('Received userRole:', userRole);
    
    localStorage.setItem('userId', userId);
    if (userName) {
      localStorage.setItem('userName', userName);
    }
    if (userRole) {
      localStorage.setItem('userRole', userRole);
      console.log('Saved to localStorage:', userRole);
    }
    
    setIsAuthenticated(true);
    setUserId(userId);
    setUserName(userName || null);
    setUserRole(userRole || 'CLIENTE');
    
    console.log('State updated to:', userRole || 'CLIENTE');
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserId(null);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userName, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};