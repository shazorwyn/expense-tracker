import { Line } from 'react-chartjs-2';
import './ChartSetup';
import type { MonthlySummary } from '../../types';

export default function MonthlyTrendChart({ data }: { data: MonthlySummary[] }) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Net Balance',
        data: data.map((d) => d.income - d.expense),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      }}
    />
  );
}
