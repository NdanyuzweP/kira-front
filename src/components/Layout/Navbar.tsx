import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckSquare, Users, Wallet, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.role === 'admin') {
    return null;
  }

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav z-40 safe-area-bottom">
      <div className="mobile-container max-w-md mx-auto">
        <div className="flex justify-around items-center py-2 px-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center p-3 rounded-2xl transition-all duration-300 touch-target ripple ${
                  isActive
                    ? 'nav-active text-white transform scale-105'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/30'
                }`
              }
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;