import React from 'react';
import { Award, Eye, Copy, Calendar, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getCertificatesForHolder } = useData();
  
  // Get certificates for current holder
  const holderCertificates = getCertificatesForHolder(
    currentUser?.name || '',
    currentUser?.email
  );

  const handleCopyId = (certificateId: string) => {
    navigator.clipboard.writeText(certificateId);
    toast.success('Certificate ID copied to clipboard!');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Certificates
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage your issued certificates ({holderCertificates.length} total)
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        {holderCertificates.length > 0 ? (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {holderCertificates.length}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Total Certificates
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {new Set(holderCertificates.map(c => c.issuerName)).size}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Different Issuers
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {holderCertificates.filter(c => new Date(c.issueDate).getFullYear() === new Date().getFullYear()).length}
                    </p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      This Year
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificates List */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Certificates
              </h2>
              
              <div className="space-y-4">
                {holderCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {cert.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {cert.course}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>Issued by {cert.issuerName}</span>
                              <span>•</span>
                              <span>{formatDate(cert.issueDate)}</span>
                            </div>
                            
                            <div className="mt-3">
                              <code className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                                {cert.id}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCopyId(cert.id)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy ID
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Award className="w-12 h-12" />}
            title="No certificates found"
            description="You don't have any certificates yet. Certificates issued to your name will appear here automatically."
          />
        )}
      </div>
    </div>
  );
};