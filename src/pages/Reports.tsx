import { useMemo, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import { useTransactions } from '../hooks/useTransactions';
import { getCategoryTotals, getMonthlySummaries, calculateTotals } from '../utils/insights';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../services/exportService';
import { formatCurrency } from '../utils/formatters';

export default function Reports() {
  const { transactions, loading } = useTransactions();
  const [range, setRange] = useState<'3' | '6' | '12'>('6');

  const monthlySummaries = useMemo(() => getMonthlySummaries(transactions, Number(range)), [transactions, range]);
  const expenseCategories = useMemo(() => getCategoryTotals(transactions, 'expense'), [transactions]);
  const incomeCategories = useMemo(() => getCategoryTotals(transactions, 'income'), [transactions]);
  const { income, expense, balance } = calculateTotals(transactions);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No data to report yet"
        description="Add some transactions first, and your reports will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visualize your financial trends and spending patterns.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={range} onChange={(e) => setRange(e.target.value as typeof range)} className="w-40">
            <option value="3">Last 3 months</option>
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
          </Select>
          <Button variant="secondary" onClick={() => exportTransactionsToCSV(transactions)}>
            <Download size={16} /> CSV
          </Button>
          <Button variant="secondary" onClick={() => exportTransactionsToPDF(transactions)}>
            <FileText size={16} /> PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p className="mt-1 text-xl font-bold text-income-600">{formatCurrency(income)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="mt-1 text-xl font-bold text-expense-600">{formatCurrency(expense)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Balance</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(balance)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Income vs. Expense</h2>
        <div className="h-72">
          <IncomeExpenseChart data={monthlySummaries} />
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Trend (Net Balance)</h2>
        <div className="h-72">
          <MonthlyTrendChart data={monthlySummaries} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Expense Distribution</h2>
          {expenseCategories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No expense data yet.</p>
          ) : (
            <div className="h-72">
              <CategoryPieChart data={expenseCategories} />
            </div>
          )}
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Income Distribution</h2>
          {incomeCategories.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No income data yet.</p>
          ) : (
            <div className="h-72">
              <CategoryPieChart data={incomeCategories} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
