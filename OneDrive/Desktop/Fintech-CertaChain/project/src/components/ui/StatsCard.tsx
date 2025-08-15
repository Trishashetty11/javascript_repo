import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  className = ''
}) => {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    orange: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
  };

  const iconColors = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  return (
    <div className={`rounded-2xl border p-6 ${colors[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-white dark:bg-gray-800 ${iconColors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};