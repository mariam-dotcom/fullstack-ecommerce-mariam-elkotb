import { createContext, useContext, useState, useCallback } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => {
    const raw = localStorage.getItem('nimbus_account');
    return raw ? JSON.parse(raw) : null;
  });

  const persist = useCallback((token, account) => {
    localStorage.setItem('nimbus_token', token);
    localStorage.setItem('nimbus_account', JSON.stringify(account));
    setAccount(account);
  }, []);

  const signUp = useCallback(async (payload) => {
    const { data } = await client.post('/auth/sign-up', payload);
    persist(data.token, data.account);
    return data.account;
  }, [persist]);

  const signIn = useCallback(async (payload) => {
    const { data } = await client.post('/auth/sign-in', payload);
    persist(data.token, data.account);
    return data.account;
  }, [persist]);

  const signOut = useCallback(() => {
    localStorage.removeItem('nimbus_token');
    localStorage.removeItem('nimbus_account');
    setAccount(null);
  }, []);

  return (
    <AuthContext.Provider value={{ account, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
