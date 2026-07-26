import { useMemo } from 'react';
import type { Transaction } from '../types';
import { generateBudgetInsights } from '../utils/insights';

export function useBudgetInsights(transactions: Transaction[]) {
  return useMemo(() => generateBudgetInsights(transactions), [transactions]);
}
