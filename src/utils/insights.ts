import type { BudgetInsight, CategoryTotal, MonthlySummary, Transaction } from '../types';
import { formatCurrency, formatMonthYear } from './formatters';

export function calculateTotals(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
}

export function getCategoryTotals(transactions: Transaction[], type: 'income' | 'expense'): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== type) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlySummaries(transactions: Transaction[], months = 6): MonthlySummary[] {
  const now = new Date();
  const buckets: MonthlySummary[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ month: formatMonthYear(d), income: 0, expense: 0 });
  }
  const monthKeys = buckets.map((_, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - idx), 1);
    return formatMonthYear(d);
  });

  for (const t of transactions) {
    const d = new Date(t.date);
    const key = formatMonthYear(new Date(d.getFullYear(), d.getMonth(), 1));
    const idx = monthKeys.indexOf(key);
    if (idx === -1) continue;
    if (t.type === 'income') buckets[idx].income += t.amount;
    else buckets[idx].expense += t.amount;
  }
  return buckets;
}

export function generateBudgetInsights(transactions: Transaction[]): BudgetInsight[] {
  const insights: BudgetInsight[] = [];
  const summaries = getMonthlySummaries(transactions, 2);
  const [prev, curr] = summaries;

  if (prev && curr) {
    if (prev.expense > 0) {
      const change = ((curr.expense - prev.expense) / prev.expense) * 100;
      if (change > 15) {
        insights.push({
          id: 'spend-increase',
          type: 'warning',
          message: `Your spending is up ${change.toFixed(0)}% compared to last month.`,
        });
      } else if (change < -15) {
        insights.push({
          id: 'spend-decrease',
          type: 'positive',
          message: `Nice work — spending dropped ${Math.abs(change).toFixed(0)}% compared to last month.`,
        });
      }
    }
    if (curr.income > 0 && curr.expense > curr.income) {
      insights.push({
        id: 'over-budget',
        type: 'warning',
        message: `You spent ${formatCurrency(curr.expense - curr.income)} more than you earned this month.`,
      });
    }
  }

  const categoryTotals = getCategoryTotals(transactions, 'expense');
  if (categoryTotals.length > 0) {
    const top = categoryTotals[0];
    const totalExpense = categoryTotals.reduce((sum, c) => sum + c.total, 0);
    const share = totalExpense > 0 ? (top.total / totalExpense) * 100 : 0;
    if (share > 40) {
      insights.push({
        id: 'top-category',
        type: 'info',
        message: `${top.category} makes up ${share.toFixed(0)}% of your total spending (${formatCurrency(top.total)}).`,
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      id: 'all-good',
      type: 'positive',
      message: 'Your finances look balanced this month. Keep it up!',
    });
  }

  return insights;
}
