import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navbar />
        <main className={`flex-1 ${user?.role !== 'admin' ? 'pb-20 md:pb-4 md:ml-64' : ''} pt-4`}>
          <div className="max-w-6xl mx-auto px-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;