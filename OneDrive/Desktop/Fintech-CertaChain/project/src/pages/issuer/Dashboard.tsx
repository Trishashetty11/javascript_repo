import React from 'react';
import { Link } from 'react-router-dom';
import { Award, FileText, CheckCircle2, PlusCircle, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { StatsCard } from '../../components/ui/StatsCard';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/dateHelpers';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { certificates, getIssuerStats } = useData();
  
  const issuerName = currentUser?.name || 'Demo Institute';
  const stats = getIssuerStats(issuerName);
  
  // Get recent certificates (last 5)
  const recentCertificates = certificates
    .filter(cert => cert.issuerName === issuerName)
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Issuer Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back, {currentUser?.name}. Here's an overview of your certificate activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Issued"
          value={stats.total}
          icon={<Award className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Issued This Month"
          value={stats.thisMonth}
          icon={<FileText className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Unique Holders"
          value={stats.uniqueHolders}
          icon={<Users className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto p-4 flex-col space-y-2">
            <Link to="/issuer/issue">
              <PlusCircle className="w-6 h-6" />
              <span>Issue New Certificate</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-auto p-4 flex-col space-y-2">
            <Link to="/issuer/certificates">
              <FileText className="w-6 h-6" />
              <span>View All Certificates</span>
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-auto p-4 flex-col space-y-2">
            <Link to="/issuer/verify">
              <CheckCircle2 className="w-6 h-6" />
              <span>Verify Certificate</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent Certificates */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recently Issued
          </h2>
          {certificates.length > 5 && (
            <Link
              to="/issuer/certificates"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
            >
              View all →
            </Link>
          )}
        </div>

        {recentCertificates.length > 0 ? (
          <Table headers={['Certificate ID', 'Holder Name', 'Title', 'Issue Date']}>
            {recentCertificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {cert.id}
                  </code>
                </TableCell>
                <TableCell>{cert.holderName}</TableCell>
                <TableCell>{cert.title}</TableCell>
                <TableCell>{formatDate(cert.issueDate)}</TableCell>
              </TableRow>
            ))}
          </Table>
        ) : (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No certificates issued yet"
            description="Start by issuing your first certificate to see it appear here."
            action={
              <Button asChild>
                <Link to="/issuer/issue">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Issue Certificate
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};