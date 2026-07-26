import { useMemo, useState } from 'react';
import { Plus, Download, FileText, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionRow from '../components/transactions/TransactionRow';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { addTransaction, deleteTransaction, updateTransaction } from '../services/transactionService';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../services/exportService';
import type { NewTransaction, Transaction } from '../types';

export default function Transactions() {
  const { currentUser } = useAuth();
  const { transactions, loading, error } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesSearch =
        !searchTerm ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [transactions, typeFilter, searchTerm]);

  function openAddModal() {
    setEditingTransaction(null);
    setModalOpen(true);
  }

  function openEditModal(t: Transaction) {
    setEditingTransaction(t);
    setModalOpen(true);
  }

  async function handleSubmit(values: NewTransaction) {
    if (!currentUser) return;
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, values);
    } else {
      await addTransaction(currentUser.uid, values);
    }
    setModalOpen(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteTransaction(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your income and expenses.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => exportTransactionsToCSV(filteredTransactions)}>
            <Download size={16} /> CSV
          </Button>
          <Button variant="secondary" onClick={() => exportTransactionsToPDF(filteredTransactions)}>
            <FileText size={16} /> PDF
          </Button>
          <Button onClick={openAddModal}>
            <Plus size={16} /> Add Transaction
          </Button>
        </div>
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

      <Card>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={16} />
            <input
              className="input pl-9"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="sm:w-48">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try adjusting your filters, or add a new transaction to get started."
            action={
              <Button onClick={openAddModal}>
                <Plus size={16} /> Add Transaction
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 text-right font-medium">Amount</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} onEdit={openEditModal} onDelete={setDeleteTarget} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}>
        <TransactionForm
          initialValues={editingTransaction ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Transaction">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete <span className="font-medium">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
