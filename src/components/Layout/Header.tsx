import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white px-4 py-4 border-b border-gray-100">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Vilarbucks</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;