import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Issuer pages
import { Dashboard as IssuerDashboard } from './pages/issuer/Dashboard';
import { Issue } from './pages/issuer/Issue';
import { Certificates } from './pages/issuer/Certificates';
import { Verify as IssuerVerify } from './pages/issuer/Verify';

// Holder pages
import { Dashboard as HolderDashboard } from './pages/holder/Dashboard';

// Verifier pages
import { Dashboard as VerifierDashboard } from './pages/verifier/Dashboard';
import { VerificationHistory } from './pages/verifier/History';

// Common pages
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Issuer routes */}
                <Route
                  path="/issuer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['issuer']}>
                      <IssuerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issuer/issue"
                  element={
                    <ProtectedRoute allowedRoles={['issuer']}>
                      <Issue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issuer/certificates"
                  element={
                    <ProtectedRoute allowedRoles={['issuer']}>
                      <Certificates />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issuer/verify"
                  element={
                    <ProtectedRoute allowedRoles={['issuer']}>
                      <IssuerVerify />
                    </ProtectedRoute>
                  }
                />

                {/* Holder routes */}
                <Route
                  path="/holder/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['holder']}>
                      <HolderDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Verifier routes */}
                <Route
                  path="/verifier/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['verifier']}>
                      <VerifierDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/verifier/history"
                  element={
                    <ProtectedRoute allowedRoles={['verifier']}>
                      <VerificationHistory />
                    </ProtectedRoute>
                  }
                />

                {/* Default redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;