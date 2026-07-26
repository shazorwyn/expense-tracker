export type TransactionType = 'income' | 'expense';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // ISO date string (yyyy-MM-dd)
  notes?: string;
  createdAt: number; // epoch ms
}

export type NewTransaction = Omit<Transaction, 'id' | 'userId' | 'createdAt'>;

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlySummary {
  month: string; // e.g. "Jan 2026"
  income: number;
  expense: number;
}

export interface BudgetInsight {
  id: string;
  type: 'warning' | 'positive' | 'info';
  message: string;
}
