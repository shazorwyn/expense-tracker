import { Pie } from 'react-chartjs-2';
import './ChartSetup';
import type { CategoryTotal } from '../../types';
import { CATEGORY_COLORS } from '../../utils/categories';

export default function CategoryPieChart({ data }: { data: CategoryTotal[] }) {
  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: data.map((d) => CATEGORY_COLORS[d.category] ?? '#9ca3af'),
        borderWidth: 1,
        borderColor: '#ffffff',
      },
    ],
  };

  return (
    <Pie
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
      }}
    />
  );
}
