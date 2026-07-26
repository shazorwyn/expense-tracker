import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportTransactionsToCSV(transactions: Transaction[], filename = 'transactions.csv') {
  const rows = transactions.map((t) => ({
    Title: t.title,
    Type: t.type,
    Category: t.category,
    Amount: t.amount,
    Date: t.date,
    Notes: t.notes ?? '',
  }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

export function exportTransactionsToPDF(transactions: Transaction[], filename = 'transactions.pdf') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Expense Tracker Report', 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 24);

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Total Income: ${formatCurrency(income)}`, 14, 34);
  doc.text(`Total Expense: ${formatCurrency(expense)}`, 14, 40);
  doc.text(`Balance: ${formatCurrency(income - expense)}`, 14, 46);

  autoTable(doc, {
    startY: 54,
    head: [['Title', 'Type', 'Category', 'Amount', 'Date', 'Notes']],
    body: transactions.map((t) => [
      t.title,
      t.type,
      t.category,
      formatCurrency(t.amount),
      formatDate(t.date),
      t.notes ?? '',
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [79, 70, 229] },
  });

  doc.save(filename);
}
