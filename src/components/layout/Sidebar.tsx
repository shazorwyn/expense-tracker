import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, User, Wallet } from 'lucide-react';
import clsx from 'clsx';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white dark:bg-brand-500">
          <Wallet size={18} />
        </div>
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">ExpenseTracker</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 text-xs text-gray-400 dark:text-gray-600">Expense Tracker with Budget Insights</div>
    </aside>
  );
}
