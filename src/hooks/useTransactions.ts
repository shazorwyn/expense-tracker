import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { subscribeToTransactions } from '../services/transactionService';
import type { Transaction } from '../types';

export function useTransactions() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToTransactions(
      currentUser.uid,
      (data) => {
        setTransactions(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Failed to subscribe to transactions:', err);
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [currentUser]);

  return { transactions, loading, error };
}
