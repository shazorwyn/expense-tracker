import type { TransactionType } from '../types';

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'] as const;

export const EXPENSE_CATEGORIES = [
  'Food',
  'Shopping',
  'Bills',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
] as const;

export function getCategoriesForType(type: TransactionType): readonly string[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Salary: '#10b981',
  Freelance: '#059669',
  Investment: '#34d399',
  Food: '#f59e0b',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Healthcare: '#06b6d4',
  Education: '#6366f1',
  Other: '#6b7280',
};
