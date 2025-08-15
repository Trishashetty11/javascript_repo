import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, Search, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/dateHelpers';

export const Certificates: React.FC = () => {
  const { currentUser } = useAuth();
  const { certificates } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  const issuerName = currentUser?.name || 'Demo Institute';
  
  // Filter certificates issued by current user
  const issuerCertificates = certificates.filter(cert => cert.issuerName === issuerName);
  
  // Filter by search term
  const filteredCertificates = issuerCertificates.filter(cert =>
    cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Certificates
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage all certificates you've issued ({issuerCertificates.length} total)
          </p>
        </div>
        <Button asChild>
          <Link to="/issuer/issue">
            <PlusCircle className="w-4 h-4 mr-2" />
            Issue New
          </Link>
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by ID, holder name, title, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Certificates Table */}
        {filteredCertificates.length > 0 ? (
          <Table headers={['Certificate ID', 'Holder Name', 'Title', 'Course', 'Issue Date', 'Actions']}>
            {filteredCertificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {cert.id}
                  </code>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{cert.holderName}</div>
                    {cert.holderEmail && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {cert.holderEmail}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{cert.title}</TableCell>
                <TableCell>{cert.course}</TableCell>
                <TableCell>{formatDate(cert.issueDate)}</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        ) : issuerCertificates.length === 0 ? (
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
        ) : (
          <EmptyState
            icon={<Search className="w-12 h-12" />}
            title="No certificates found"
            description="No certificates match your search criteria. Try adjusting your search terms."
          />
        )}
      </div>
    </div>
  );
};