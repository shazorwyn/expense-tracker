import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import clsx from 'clsx';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export default function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{transaction.title}</p>
        {transaction.notes && <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.notes}</p>}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {transaction.category}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{formatDate(transaction.date)}</td>
      <td className={clsx('px-4 py-3 text-right text-sm font-semibold', isIncome ? 'text-income-600' : 'text-expense-600')}>
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(transaction)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800"
            aria-label="Edit transaction"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(transaction)}
            className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
            aria-label="Delete transaction"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
