import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/wallets';
import { taskService } from '../../services/tasks';
import { Wallet, Task } from '../../types';
import { DollarSign, TrendingUp, CheckSquare, Clock, ArrowUpRight, Users, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [walletsData, tasksData] = await Promise.all([
          walletService.getWallets(),
          taskService.getTasks(),
        ]);
        setWallets(walletsData.wallets);
        setTasks(tasksData.tasks.filter(task => task.isActive).slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const activeTasks = tasks.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Card */}
      <div className="gradient-primary rounded-2xl p-6 text-white shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
            <p className="text-white/90 text-lg">
              Ready to earn some money today? You have {activeTasks} new tasks waiting!
            </p>
          </div>
        </div>
        
        <Link 
          to="/tasks"
          className="inline-block bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200 mt-4"
        >
          View Available Tasks
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Current Balance */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12.5%
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
            <p className="text-gray-600 font-medium">Current Balance</p>
          </div>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +8.2%
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">${user?.walletBalance || '0.00'}</p>
            <p className="text-gray-600 font-medium">Total Earned</p>
          </div>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              +3
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-gray-600 font-medium">Tasks Completed</p>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex items-center text-red-600 text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
              -1
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{activeTasks}</p>
            <p className="text-gray-600 font-medium">Active Tasks</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="space-y-4">
          <Link 
            to="/tasks"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Browse Tasks</span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </Link>

          <Link 
            to="/wallet/p2p"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">P2P Trading</span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </Link>

          <Link 
            to="/team"
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">Invite Friends</span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="gradient-orange rounded-2xl p-6 text-white shadow-elevated">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
            <p className="text-white/90">Welcome to Vilarbucks - Start your earning journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;