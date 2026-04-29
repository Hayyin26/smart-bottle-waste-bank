"use client";

import { useState, useEffect } from 'react';
import { getTopUsers, type Profile } from '@/services/profiles.service';
import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardProps {
  limit?: number;
}

export default function Leaderboard({ limit = 10 }: LeaderboardProps) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopUsers();
  }, [limit]);

  async function fetchTopUsers() {
    setLoading(true);
    const data = await getTopUsers(limit);
    setUsers(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Memuat leaderboard...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada data user
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="text-yellow-500" size={24} />;
      case 1:
        return <Medal className="text-gray-400" size={24} />;
      case 2:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <Award className="text-blue-500" size={20} />;
    }
  };

  const getRankBadge = (index: number) => {
    const badges = ['🥇', '🥈', '🥉'];
    return badges[index] || `#${index + 1}`;
  };

  return (
    <div className="space-y-2">
      {users.map((user, index) => (
        <div
          key={user.id}
          className={`rounded-lg border p-4 transition-all ${
            index < 3
              ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-slate-900'
              : 'border-border bg-white dark:bg-slate-900'
          } hover:shadow-md`}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800">
              {getRankIcon(index)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getRankBadge(index)}</span>
                <h3 className="font-semibold text-lg">{user.full_name || 'Anonymous'}</h3>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total Points: <span className="font-bold text-green-600">{user.total_points.toLocaleString()}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
