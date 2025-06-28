import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 safe-area-top">
      <Header />
      <main className={`${user?.role !== 'admin' ? 'pb-24' : 'pb-6'} pt-4`}>
        <div className="mobile-container max-w-md mx-auto">
          <Outlet />
        </div>
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;