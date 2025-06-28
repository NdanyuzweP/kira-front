import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Team: React.FC = () => {
  const { user } = useAuth();
  const [referralCode] = useState(`REF${user?.id}${user?.username?.toUpperCase().slice(0, 3)}`);
  
  // Mock referral data - in real app, this would come from API
  const [referralTeam] = useState([
    {
      id: 1,
      email: 'john.doe@example.com',
      name: 'JohnDoe',
      vipLevel: 1,
      level: 1,
      joinedAt: '2024-01-15',
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      name: 'JaneSmith',
      vipLevel: 2,
      level: 1,
      joinedAt: '2024-01-20',
    },
    {
      id: 3,
      email: 'alice.jones@example.com',
      name: 'AliceJones',
      vipLevel: 0,
      level: 2,
      joinedAt: '2024-02-01',
    },
    {
      id: 4,
      email: 'bob.brown@example.com',
      name: 'BobBrown',
      vipLevel: 1,
      level: 2,
      joinedAt: '2024-02-05',
    },
    {
      id: 5,
      email: 'carol.white@example.com',
      name: 'CarolWhite',
      vipLevel: 0,
      level: 3,
      joinedAt: '2024-02-10',
    },
  ]);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join P2P Trading Platform',
        text: `Use my referral code: ${referralCode}`,
        url: `${window.location.origin}/register?ref=${referralCode}`,
      });
    } else {
      copyReferralCode();
    }
  };

  const getVipBadgeColor = (level: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-blue-100 text-blue-600',
      'bg-blue-100 text-blue-600',
      'bg-blue-100 text-blue-600',
      'bg-blue-100 text-blue-600',
    ];
    return colors[level] || colors[0];
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Group team members by level
  const teamByLevel = referralTeam.reduce((acc, member) => {
    if (!acc[member.level]) {
      acc[member.level] = [];
    }
    acc[member.level].push(member);
    return acc;
  }, {} as Record<number, typeof referralTeam>);

  const sortedLevels = Object.keys(teamByLevel).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Your Team</h1>
        <p className="text-gray-600 mt-1">Manage your referral network</p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Referral Code Section - Hidden in mobile design but keeping functionality */}
        <div className="hidden">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Referral Code</h2>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Referral Code</p>
                    <p className="text-2xl font-bold text-blue-600">{referralCode}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyReferralCode}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={shareReferralCode}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Share this code with friends to earn referral bonuses!</p>
                <p className="mt-1">Referral URL: {window.location.origin}/register?ref={referralCode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Team by Level */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Your Referral Team</h2>
          </div>
          
          <div className="p-6">
            {sortedLevels.length > 0 ? (
              <div className="space-y-8">
                {sortedLevels.map((levelStr) => {
                  const level = parseInt(levelStr);
                  const members = teamByLevel[level];
                  
                  return (
                    <div key={level}>
                      {/* Level Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Level {level}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {members.length} Member{members.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Level Members */}
                      <div className="space-y-3">
                        {members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                              {/* Avatar */}
                              <div className={`w-10 h-10 ${getAvatarColor(member.name)} rounded-full flex items-center justify-center`}>
                                <span className="text-white font-semibold text-sm">
                                  {getInitials(member.name)}
                                </span>
                              </div>
                              
                              {/* Member Info */}
                              <div>
                                <p className="font-semibold text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.email}</p>
                              </div>
                            </div>
                            
                            {/* Level Badge */}
                            <div>
                              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getVipBadgeColor(member.vipLevel)}`}>
                                Level {member.vipLevel}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No referrals yet</p>
                <p className="text-sm text-gray-400 mt-1">Share your referral code to start building your team</p>
              </div>
            )}
          </div>
        </div>

        {/* Team Statistics - Hidden in mobile design but keeping for functionality */}
        <div className="hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">{referralTeam.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Level 1</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralTeam.filter(r => r.level === 1).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Level 2</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {referralTeam.filter(r => r.level === 2).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;