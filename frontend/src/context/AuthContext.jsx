import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auramart_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-9812',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'customer',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zip: '97477',
        country: 'United States'
      }
    };
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('auramart_user', JSON.stringify(user));
  }, [user]);

  const toggleAdminMode = () => setIsAdminMode(prev => !prev);

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, isAdminMode, toggleAdminMode, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
