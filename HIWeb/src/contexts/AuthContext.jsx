import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For MVP, we'll use localStorage for user persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('hiUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (fullName, email, identity) => {
    // In a real app, this would call an API
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      identity,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('hiUser', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('hiUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;