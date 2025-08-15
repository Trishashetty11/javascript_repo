import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on user role
    const roleRoutes = {
      issuer: '/issuer/dashboard',
      holder: '/holder/dashboard',
      verifier: '/verifier/dashboard'
    };
    return <Navigate to={roleRoutes[currentUser.role as keyof typeof roleRoutes]} replace />;
  }

  return <>{children}</>;
};