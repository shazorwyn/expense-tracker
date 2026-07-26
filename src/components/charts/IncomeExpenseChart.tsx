import { Bar } from 'react-chartjs-2';
import './ChartSetup';
import type { MonthlySummary } from '../../types';

export default function IncomeExpenseChart({ data }: { data: MonthlySummary[] }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: data.map((d) => d.income),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
      {
        label: 'Expense',
        data: data.map((d) => d.expense),
        backgroundColor: '#ef4444',
        borderRadius: 6,
      },
    ],
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        scales: { y: { beginAtZero: true } },
      }}
    />
  );
}
