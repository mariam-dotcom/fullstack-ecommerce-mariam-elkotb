import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from './AuthContext';

const BasketContext = createContext(null);

export function BasketProvider({ children }) {
  const { account } = useAuth();
  const [rows, setRows] = useState([]);
  const [totalCents, setTotalCents] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!account) {
      setRows([]);
      setTotalCents(0);
      return;
    }
    setLoading(true);
    try {
      const { data } = await client.get('/basket');
      setRows(data.rows);
      setTotalCents(data.totalCents);
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (itemId, quantity = 1) => {
    await client.post('/basket', { itemId, quantity });
    await refresh();
  }, [refresh]);

  const updateQuantity = useCallback(async (basketItemId, quantity) => {
    await client.patch(`/basket/${basketItemId}`, { quantity });
    await refresh();
  }, [refresh]);

  const removeItem = useCallback(async (basketItemId) => {
    await client.delete(`/basket/${basketItemId}`);
    await refresh();
  }, [refresh]);

  return (
    <BasketContext.Provider value={{ rows, totalCents, loading, addItem, updateQuantity, removeItem }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error('useBasket must be used within BasketProvider');
  return ctx;
}
