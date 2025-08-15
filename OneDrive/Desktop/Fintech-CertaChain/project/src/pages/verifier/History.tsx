import React from 'react';
import { History, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDateTime, getRelativeTime } from '../../utils/dateHelpers';

export const VerificationHistory: React.FC = () => {
  const { currentUser } = useAuth();
  const { verificationHistory } = useData();
  
  // Filter verification history for current verifier
  const userHistory = verificationHistory
    .filter(record => record.verifierEmail === currentUser?.email)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verification History
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your certificate verification history ({userHistory.length} total)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {userHistory.length > 0 ? (
          <Table headers={['Certificate ID', 'Status', 'Verification Time', 'Details']}>
            {userHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {record.certificateId}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {record.status === 'Valid' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <Badge variant="success">Valid</Badge>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <Badge variant="error">Invalid</Badge>
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {getRelativeTime(record.timestamp)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(record.timestamp)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Verified by {currentUser?.name}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        ) : (
          <EmptyState
            icon={<History className="w-12 h-12" />}
            title="No verification history"
            description="Your certificate verification history will appear here once you start verifying certificates."
          />
        )}
      </div>

      {/* Statistics */}
      {userHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Search className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userHistory.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Verifications
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userHistory.filter(r => r.status === 'Valid').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valid Certificates
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userHistory.filter(r => r.status === 'Invalid').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Invalid Certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};