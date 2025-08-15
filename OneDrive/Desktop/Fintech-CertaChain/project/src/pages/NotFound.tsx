import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const NotFound: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated || !currentUser) return '/login';
    
    const roleRoutes = {
      issuer: '/issuer/dashboard',
      holder: '/holder/dashboard',
      verifier: '/verifier/dashboard'
    };
    
    return roleRoutes[currentUser.role as keyof typeof roleRoutes] || '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              404
            </h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The page you're looking for doesn't exist or you don't have permission to access it.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link to={getDashboardPath()}>
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};