import React, { useEffect, useState } from 'react';
import { taskService } from '../../services/tasks';
import { subscriptionService } from '../../services/subscriptions';
import { Task, Subscription } from '../../types';
import { CheckSquare, Clock, Award, Star, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTask, setCompletingTask] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, subscriptionsData] = await Promise.all([
          taskService.getTasks(),
          subscriptionService.getSubscriptions(),
        ]);
        setTasks(tasksData.tasks);
        setSubscriptions(subscriptionsData.subscriptions);
      } catch (error) {
        console.error('Error fetching tasks data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompleteTask = async (taskId: number) => {
    setCompletingTask(taskId);
    try {
      const result = await taskService.completeTask(taskId);
      toast.success(`Task completed! Earned ${result.reward.amount} reward`);
      setTasks(tasks.filter(task => task.id !== taskId || task.taskType !== 'one-time'));
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setCompletingTask(null);
    }
  };

  const handleSubscribe = async (subscriptionId: number) => {
    try {
      await subscriptionService.subscribe(subscriptionId);
      toast.success('Successfully subscribed to VIP plan!');
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">VIP Membership</h1>
        <p className="text-gray-600">Choose your earning level and start making money daily</p>
        
        <div className="flex items-center justify-center mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
          <Crown className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Current: VIP 0</span>
        </div>
      </div>

      {/* VIP Memberships */}
      <div className="space-y-4">
        {subscriptions.map((subscription, index) => (
          <div 
            key={subscription.id} 
            className={`bg-white rounded-2xl p-6 shadow-card border-2 transition-all duration-200 ${
              index === 0 ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{subscription.name}</h3>
                {index === 0 && subscription.price === 0 && (
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mt-2">
                    <CheckSquare className="h-4 w-4 mr-1" />
                    Active
                  </div>
                )}
              </div>
              {subscription.price > 0 && (
                <span className="text-sm text-gray-600">${subscription.price} investment</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center text-green-600 mb-2">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">${subscription.maxOrderAmount / 100}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium">Daily</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center text-blue-600 mb-2">
                  <Calendar className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">${subscription.price}</span>
                </div>
                <p className="text-gray-600 text-sm font-medium">Monthly</p>
              </div>
            </div>

            {index === 0 ? (
              <button className="w-full bg-green-100 text-green-800 py-3 px-6 rounded-xl font-semibold">
                Receive Tasks
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(subscription.id)}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Available Tasks */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Available Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    
                    <div className="flex items-center mt-3 space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {task.taskType}
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <Award className="h-4 w-4 mr-1" />
                        {task.rewardAmount} {task.rewardCurrency?.symbol}
                      </div>
                    </div>

                    {task.validUntil && (
                      <p className="text-sm text-orange-600 mt-2">
                        Valid until: {new Date(task.validUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    disabled={completingTask === task.id}
                    className="ml-4 bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {completingTask === task.id ? 'Completing...' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;