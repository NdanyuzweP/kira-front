import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, TrendingUp, Wallet, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role === 'admin') {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/wallet/p2p', icon: TrendingUp, label: 'Trading' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-teal-600'
                    : 'text-gray-500 hover:text-teal-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-teal-50' : ''}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-xs mt-1 font-medium">{label}</span>
                  {isActive && (
                    <div className="w-1 h-1 bg-teal-600 rounded-full mt-1"></div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navigation */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 pt-20 z-40">
        <div className="px-4 py-6">
          <div className="space-y-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-50 text-teal-600 border border-teal-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;