import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Settings, User, Bell } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-header sticky top-0 z-50 safe-area-top">
      <div className="mobile-container max-w-md mx-auto">
        <div className="flex justify-between items-center h-16 px-1">
          {/* Logo and User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-mobile">
              <span className="text-white font-bold text-lg">P2P</span>
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text">P2P Trading</h1>
              {user && (
                <p className="text-xs text-slate-600">
                  Hi, <span className="font-semibold text-indigo-600">{user.username}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Balance Display */}
            {user && (
              <div className="flex items-center space-x-2 px-3 py-2 glass-card rounded-xl shadow-mobile">
                <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center status-online">
                  <span className="text-white text-xs font-bold">$</span>
                </div>
                <span className="text-sm font-bold text-slate-800">${user.walletBalance}</span>
              </div>
            )}
            
            {/* Notification Bell */}
            <button className="p-2 glass-card rounded-xl text-slate-600 hover:text-indigo-600 transition-all duration-200 touch-target ripple">
              <Bell size={18} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            
            {/* Settings for Admin */}
            {user?.role === 'admin' && (
              <button className="p-2 glass-card rounded-xl text-slate-600 hover:text-indigo-600 transition-all duration-200 touch-target ripple">
                <Settings size={18} />
              </button>
            )}
            
            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 glass-card rounded-xl text-slate-600 hover:text-red-600 transition-all duration-200 touch-target ripple"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;