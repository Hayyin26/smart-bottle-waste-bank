"use client";

import Container from "@/components/container";
import TransactionList from "@/components/iot/transaction-list";
import DeviceStatus from "@/components/iot/device-status";
import Leaderboard from "@/components/iot/leaderboard";
import WeeklyActivityChart from "@/components/dashboard/weekly-activity-chart";
import TopUsersChart from "@/components/dashboard/top-users-chart";
import { getTopUsers, type Profile, getTotalUsers } from "@/services/profiles.service";
import {
  getTotalTransactions,
  getTotalPointsDistributed,
  getWeeklyActivity,
  type DailyActivityData,
} from "@/services/transactions.service";
import { getTotalDevices } from "@/services/iot-devices.service";
import { useState, useEffect } from "react";
import { Users, Activity, Award, Wifi } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalPoints: 0,
    totalDevices: 0,
  });
  const [weeklyData, setWeeklyData] = useState<DailyActivityData[]>([]);
  const [topUsers, setTopUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchStats() {
    setLoading(true);
    const [usersResult, transactionsResult, pointsResult, devicesResult, weeklyResult, topUsersResult] =
      await Promise.allSettled([
        getTotalUsers(),
        getTotalTransactions(),
        getTotalPointsDistributed(),
        getTotalDevices(),
        getWeeklyActivity(),
        getTopUsers(5),
      ]);

    const users = usersResult.status === 'fulfilled' ? usersResult.value : 0;
    const transactions = transactionsResult.status === 'fulfilled' ? transactionsResult.value : 0;
    const points = pointsResult.status === 'fulfilled' ? pointsResult.value : 0;
    const devices = devicesResult.status === 'fulfilled' ? devicesResult.value : 0;
    const weekly = weeklyResult.status === 'fulfilled' ? weeklyResult.value : [];
    const topUsersData = topUsersResult.status === 'fulfilled' ? topUsersResult.value : [];

    if (usersResult.status === 'rejected') {
      console.error('Failed to fetch total users:', usersResult.reason);
    }
    if (transactionsResult.status === 'rejected') {
      console.error('Failed to fetch total transactions:', transactionsResult.reason);
    }
    if (pointsResult.status === 'rejected') {
      console.error('Failed to fetch total points:', pointsResult.reason);
    }
    if (devicesResult.status === 'rejected') {
      console.error('Failed to fetch total devices:', devicesResult.reason);
    }
    if (weeklyResult.status === 'rejected') {
      console.error('Failed to fetch weekly activity:', weeklyResult.reason);
    }
    if (topUsersResult.status === 'rejected') {
      console.error('Failed to fetch top users:', topUsersResult.reason);
    }
    
    setStats({
      totalUsers: users,
      totalTransactions: transactions,
      totalPoints: points,
      totalDevices: devices,
    });
    setWeeklyData(weekly);
    setTopUsers(topUsersData);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      icon: Activity,
      label: "Total Scans",
      value: stats.totalTransactions,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      icon: Award,
      label: "Points Distributed",
      value: stats.totalPoints.toLocaleString(),
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      icon: Wifi,
      label: "IoT Devices",
      value: stats.totalDevices,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    },
  ];

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard IoT QR System</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </Container>

      {/* Stats Cards */}
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-lg p-3 ${stat.color}`}>
                    <StatIcon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Dashboard Charts */}
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <WeeklyActivityChart data={weeklyData} />
          <TopUsersChart users={topUsers} />
        </div>
      </Container>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions - 2 columns */}
        <Container className="py-4 lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Scans</h2>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            </div>
            <TransactionList limit={10} />
          </div>
        </Container>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Device Status */}
          <Container className="py-4">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Device Status</h2>
              <DeviceStatus />
            </div>
          </Container>

          {/* Leaderboard */}
          <Container className="py-4">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Top Users</h2>
              <Leaderboard limit={5} />
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
