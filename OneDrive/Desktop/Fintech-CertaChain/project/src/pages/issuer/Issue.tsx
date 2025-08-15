import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { issueCertificate } from '../../services/blockchain';
import { generateCertificateId } from '../../utils/idGenerator';
import { getTodayDate } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export const Issue: React.FC = () => {
  const { currentUser } = useAuth();
  const { addCertificate } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    holderName: '',
    holderEmail: '',
    title: '',
    course: '',
    issueDate: getTodayDate(),
    fileName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.holderName.trim() || !formData.title.trim() || !formData.course.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const certificateId = generateCertificateId();
      const certificateData = {
        id: certificateId,
        holderName: formData.holderName.trim(),
        holderEmail: formData.holderEmail.trim() || undefined,
        title: formData.title.trim(),
        course: formData.course.trim(),
        issueDate: formData.issueDate,
        issuerName: currentUser?.name || 'Demo Institute',
        fileName: formData.fileName || undefined
      };

      // Simulate blockchain transaction
      await issueCertificate(certificateData);
      
      // Add to local storage
      addCertificate(certificateData);
      
      toast.success(`Certificate issued successfully! ID: ${certificateId}`);
      
      // Reset form
      setFormData({
        holderName: '',
        holderEmail: '',
        title: '',
        course: '',
        issueDate: getTodayDate(),
        fileName: ''
      });
      
      // Navigate to certificates list
      setTimeout(() => {
        navigate('/issuer/certificates');
      }, 2000);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Issue Certificate
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Create and issue a new certificate on the blockchain
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Holder Name *"
              name="holderName"
              value={formData.holderName}
              onChange={handleChange}
              placeholder="Full name of certificate holder"
              required
            />
            
            <Input
              label="Holder Email"
              type="email"
              name="holderEmail"
              value={formData.holderEmail}
              onChange={handleChange}
              placeholder="holder@example.com (optional)"
            />
          </div>

          <Input
            label="Certificate Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Certificate of Completion"
            required
          />

          <Input
            label="Course/Program Name *"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="e.g., Web Development Bootcamp"
            required
          />

          <Input
            label="Issue Date *"
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Certificate File (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Choose file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </label>
              {formData.fileName && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.fileName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PDF, JPG, JPEG, PNG files supported
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/issuer/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};