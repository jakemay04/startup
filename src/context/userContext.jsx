import React, { createContext, useState, useEffect } from 'react';
import { AuthState } from '../login/authstate';

export const UserContext = createContext({
  user: null,
  authState: AuthState.Unauthenticated,
  setUser: () => {},
  clearUser: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pf_user')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('pf_user', JSON.stringify(user));
      else localStorage.removeItem('pf_user');
    } catch (e) {
      console.warn('Could not persist user', e);
    }
  }, [user]);

  const clearUser = async () => {
    try {
      await fetch('api/auth', { method: 'DELETE' }); 
    } catch (e) {
      console.error('Error during logout API call', e);
    }
    setUser(null);
  };

  const authState = user ? AuthState.Authenticated : AuthState.Unauthenticated;

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, authState}}>
      {children}
    </UserContext.Provider>
  );
}