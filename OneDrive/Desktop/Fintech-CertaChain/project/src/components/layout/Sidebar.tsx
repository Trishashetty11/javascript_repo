import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  CheckCircle2, 
  Eye,
  History,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { currentUser } = useAuth();

  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'issuer':
        return [
          { to: '/issuer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/issuer/issue', icon: PlusCircle, label: 'Issue Certificate' },
          { to: '/issuer/certificates', icon: FileText, label: 'All Certificates' },
          { to: '/issuer/verify', icon: CheckCircle2, label: 'Verify Certificate' }
        ];
      case 'holder':
        return [
          { to: '/holder/dashboard', icon: LayoutDashboard, label: 'My Certificates' }
        ];
      case 'verifier':
        return [
          { to: '/verifier/dashboard', icon: CheckCircle2, label: 'Verify' },
          { to: '/verifier/history', icon: History, label: 'Verification History' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="fixed left-0 top-16 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 pt-6">
      <nav className="px-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};