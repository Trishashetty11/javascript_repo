import React, { useState } from 'react';
import { CheckCircle2, XCircle, Search, Award, Calendar, User, Building } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { verifyCertificate } from '../../services/blockchain';
import { formatDate } from '../../utils/dateHelpers';
import { Certificate } from '../../types';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { certificates, addVerificationRecord } = useData();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    valid: boolean;
    certificate?: Certificate;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const verificationResult = await verifyCertificate(certificateId.trim(), certificates);
      setResult(verificationResult);
      
      // Add verification record
      addVerificationRecord({
        id: Math.random().toString(36).slice(2),
        certificateId: certificateId.trim(),
        status: verificationResult.valid ? 'Valid' : 'Invalid',
        timestamp: Date.now(),
        verifierEmail: currentUser?.email || 'unknown@verifier.com'
      });

      // Show toast notification
      if (verificationResult.valid) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error('Certificate not found or invalid');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Certificate Verification
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Verify the authenticity of certificates on the blockchain
        </p>
      </div>

      {/* Verification Form */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Verify Certificate
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enter a certificate ID to verify its authenticity
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <Input
              label="Certificate ID"
              value={certificateId}
              onChange={(e) => setCertificateId(e.target.value)}
              placeholder="Enter certificate ID (e.g., CERT-ABC123)"
              className="text-lg"
              disabled={loading}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              loading={loading}
              disabled={!certificateId.trim()}
              className="flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Verify Certificate
            </Button>
            
            {result && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
              >
                Verify Another
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center space-x-3">
            <Spinner size="md" />
            <span className="text-gray-600 dark:text-gray-400">
              Verifying certificate on blockchain...
            </span>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {result && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center space-x-4 mb-6">
            {result.valid ? (
              <>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                    Certificate Valid ✓
                  </h3>
                  <p className="text-green-700 dark:text-green-300">
                    This certificate has been verified on the blockchain
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-900 dark:text-red-100">
                    Certificate Invalid ✗
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    This certificate could not be found or verified
                  </p>
                </div>
              </>
            )}
          </div>

          {result.valid && result.certificate && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Certificate Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Holder</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.certificate.holderName}
                      </p>
                      {result.certificate.holderEmail && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.certificate.holderEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Certificate Title</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.certificate.title}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Issued by</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {result.certificate.issuerName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Issue Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(result.certificate.issueDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Course:</span> {result.certificate.course}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Certificate ID:</span>{' '}
                  <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded text-xs">
                    {result.certificate.id}
                  </code>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};