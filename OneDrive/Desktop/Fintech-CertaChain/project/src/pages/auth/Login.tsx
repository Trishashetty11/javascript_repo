import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const Login: React.FC = () => {
  const { login, isAuthenticated, currentUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'holder'
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated && currentUser) {
    const roleRoutes = {
      issuer: '/issuer/dashboard',
      holder: '/holder/dashboard',
      verifier: '/verifier/dashboard'
    };
    return <Navigate to={roleRoutes[currentUser.role as keyof typeof roleRoutes]} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData.email, formData.password, formData.role);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to CertaChain
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your certificate verification system
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />

            <Select
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'holder', label: 'Certificate Holder' },
                { value: 'issuer', label: 'Certificate Issuer' },
                { value: 'verifier', label: 'Certificate Verifier' }
              ]}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>

          <div className="text-center">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 text-sm font-medium"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </form>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Demo Accounts:</h3>
          <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Issuer: issuer@demo.com / demo123</p>
            <p>• Holder: holder@demo.com / demo123</p>
            <p>• Verifier: verifier@demo.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
};