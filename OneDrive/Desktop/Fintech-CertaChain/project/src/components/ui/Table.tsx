import React, { ReactNode } from 'react';

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {children}
        </tbody>
      </table>
    </div>
  );
};

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${className}`}>
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className = '' }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>
      {children}
    </td>
  );
};