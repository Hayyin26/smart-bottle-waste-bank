"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  Award,
  RefreshCw,
  Download
} from 'lucide-react';

interface Summary {
  total_bottles: number;
  total_points: number;
  avg_points_per_bottle: number;
  unique_users: number;
}

interface BottleCount {
  size: string;
  count: number;
}

interface DailyStats {
  date: string;
  bottles: number;
  points: number;
}

interface UserRanking {
  user_id: string;
  user_name: string;
  total_bottles: number;
  total_points: number;
}

interface AnalyticsData {
  summary: Summary;
  by_size: BottleCount[];
  by_date: DailyStats[];
  top_users: UserRanking[];
}

export default function HadoopAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/hadoop/analytics');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
        setLastUpdated(new Date(result.metadata.last_updated).toLocaleString());
      } else {
        setError(result.error || 'Failed to fetch analytics');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const exportToCSV = () => {
    if (!data) return;
    
    let csv = 'Hadoop Analytics Export\n\n';
    csv += 'Summary\n';
    csv += `Total Bottles,${data.summary.total_bottles}\n`;
    csv += `Total Points,${data.summary.total_points}\n`;
    csv += `Average Points per Bottle,${data.summary.avg_points_per_bottle}\n`;
    csv += `Unique Users,${data.summary.unique_users}\n\n`;
    
    csv += 'Bottles by Size\n';
    csv += 'Size,Count\n';
    data.by_size.forEach(item => {
      csv += `${item.size},${item.count}\n`;
    });
    
    csv += '\nDaily Statistics\n';
    csv += 'Date,Bottles,Points\n';
    data.by_date.forEach(item => {
      csv += `${item.date},${item.bottles},${item.points}\n`;
    });
    
    csv += '\nTop Users\n';
    csv += 'Rank,Name,User ID,Total Bottles,Total Points\n';
    data.top_users.forEach((item, index) => {
      csv += `${index + 1},${item.user_name},${item.user_id},${item.total_bottles},${item.total_points}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hadoop-analytics-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics from Hadoop...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">❌ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxCount = Math.max(...data.by_size.map(item => item.count), 1);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hadoop Analytics</h1>
          <p className="text-gray-600 mt-1">
            Big Data insights from distributed storage
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bottles</p>
              <p className="text-3xl font-bold mt-2">{data.summary.total_bottles.toLocaleString()}</p>
            </div>
            <Package className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold mt-2">{data.summary.total_points.toLocaleString()}</p>
            </div>
            <Award className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Points/Bottle</p>
              <p className="text-3xl font-bold mt-2">{data.summary.avg_points_per_bottle}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-3xl font-bold mt-2">{data.summary.unique_users}</p>
            </div>
            <Users className="w-12 h-12 text-orange-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bottles by Size */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Bottles by Size</h2>
          </div>
          <div className="space-y-4">
            {data.by_size.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.size}</span>
                  <span className="text-sm text-gray-600">{item.count} bottles</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {data.by_size.length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-bold">Daily Trend</h2>
          </div>
          <div className="space-y-3">
            {data.by_date.slice(-7).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium">{item.date}</p>
                  <p className="text-xs text-gray-600">{item.bottles} bottles</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{item.points}</p>
                  <p className="text-xs text-gray-600">points</p>
                </div>
              </div>
            ))}
            {data.by_date.length === 0 && (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Users Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold">Top Contributors</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Nama</th>
                <th className="text-left py-3 px-4">User ID</th>
                <th className="text-right py-3 px-4">Bottles</th>
                <th className="text-right py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {data.top_users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">{user.user_name}</td>
                  <td className="py-3 px-4 font-medium">{user.user_id}</td>
                  <td className="py-3 px-4 text-right">{user.total_bottles}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-600">
                    {user.total_points}
                  </td>
                </tr>
              ))}
              {data.top_users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📊 Data Source:</strong> Hadoop HDFS (Distributed File System)
          <br />
          <strong>🔄 Processing:</strong> MapReduce-style aggregation
          <br />
          <strong>📈 Analytics:</strong> Real-time calculation from historical data
        </p>
      </div>
    </div>
  );
}
