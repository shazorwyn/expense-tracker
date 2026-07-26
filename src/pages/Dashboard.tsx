import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgetInsights } from '../hooks/useBudgetInsights';
import { calculateTotals, getMonthlySummaries } from '../utils/insights';
import { formatCurrency, formatDate } from '../utils/formatters';
import clsx from 'clsx';

export default function Dashboard() {
  const { transactions, loading, error } = useTransactions();
  const { income, expense, balance } = calculateTotals(transactions);
  const monthlySummaries = getMonthlySummaries(transactions, 6);
  const insights = useBudgetInsights(transactions);
  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Here's an overview of your financial activity.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          <p className="font-medium">Couldn't load live transaction data.</p>
          <p className="mt-1">{error}</p>
          <p className="mt-1">
            This is usually a missing Firestore composite index. Check the browser console for a link to create it,
            or open the Indexes tab in the Firebase console for this project.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(balance)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Wallet size={20} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
              <p className="mt-1 text-2xl font-bold text-income-600">{formatCurrency(income)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-income-50 text-income-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
              <p className="mt-1 text-2xl font-bold text-expense-600">{formatCurrency(expense)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-expense-50 text-expense-600">
              <TrendingDown size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Summary</h2>
          <div className="h-72">
            <IncomeExpenseChart data={monthlySummaries} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Budget Insights</h2>
          <div className="space-y-3">
            {insights.map((insight) => {
              const Icon = insight.type === 'warning' ? AlertTriangle : insight.type === 'positive' ? CheckCircle2 : Info;
              const colorClass =
                insight.type === 'warning'
                  ? 'bg-amber-50 text-amber-700'
                  : insight.type === 'positive'
                  ? 'bg-income-50 text-income-600'
                  : 'bg-brand-50 text-brand-600';
              return (
                <div key={insight.id} className={clsx('flex items-start gap-2 rounded-lg p-3 text-sm', colorClass)}>
                  <Icon size={18} className="mt-0.5 shrink-0" />
                  <p>{insight.message}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <Link to="/transactions" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add your first transaction to start tracking your finances."
            action={
              <Link to="/transactions" className="btn-primary">
                Add Transaction
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>
                <span
                  className={clsx(
                    'text-sm font-semibold',
                    t.type === 'income' ? 'text-income-600' : 'text-expense-600'
                  )}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
