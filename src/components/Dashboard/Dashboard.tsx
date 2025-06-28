import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { walletService } from '../../services/wallets';
import { taskService } from '../../services/tasks';
import type { Wallet, Task } from '../../types';
import { DollarSign, TrendingUp, CheckSquare, Star, ArrowRight, Zap, Gift, Target, Clock, Users } from 'lucide-react';

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
        setTasks(tasksData.tasks.filter(task => task.isActive).slice(0, 3));
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
        <div className="w-16 h-16 gradient-primary rounded-2xl pulse-glow flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4 bg-gray-50 min-h-screen">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl p-6 mx-4 mt-4 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Welcome back, {user?.username}! 👋</h1>
        </div>
        <p className="text-white/90 mb-4">
          Ready to earn some money today? You have {activeTasks} new tasks waiting!
        </p>
        <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200">
          View Available Tasks
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mx-4">
        {/* Current Balance */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${user?.walletBalance || '0.00'}</p>
          <p className="text-gray-500 text-sm">Current Balance</p>
        </div>

        {/* Total Earned */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
          <p className="text-gray-500 text-sm">Total Earned</p>
        </div>

        {/* Tasks Completed */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
          <p className="text-gray-500 text-sm">Tasks Completed</p>
        </div>

        {/* Active Tasks */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex items-center text-red-500 text-sm">
              <span className="mr-1">↓</span>
              -1
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
          <p className="text-gray-500 text-sm">Active Tasks</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mx-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Browse Tasks</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">P2P Trading</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">Invite Friends</span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="mx-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">Achievement Unlocked!</span>
          </div>
        </div>
      </div>

      {/* Available Tasks (if any) */}
      {tasks.length > 0 && (
        <div className="mx-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 text-indigo-500 mr-2" />
                  Available Tasks
                </h3>
                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{task.title}</h4>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-lg">
                            {task.taskType}
                          </span>
                          <span className="text-xs font-bold text-green-600 flex items-center">
                            <Gift className="h-3 w-3 mr-1" />
                            +{task.rewardAmount} {task.rewardCurrency?.symbol}
                          </span>
                        </div>
                      </div>
                      <button className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-xs hover:bg-indigo-700 transition-colors">
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallets Overview (if any) */}
      {wallets.length > 0 && (
        <div className="mx-4">
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                My Wallets
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {wallet.currency?.symbol?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{wallet.currency?.name}</h4>
                          <p className="text-xs text-gray-600">{wallet.currency?.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">{wallet.balance}</p>
                        {wallet.frozenBalance > 0 && (
                          <p className="text-xs text-orange-600">
                            Frozen: {wallet.frozenBalance}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;