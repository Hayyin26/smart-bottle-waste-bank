import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const HADOOP_CONTAINER = 'hadoop-namenode';

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

/**
 * Parse CSV data from Hadoop
 */
function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }
  
  return data;
}

/**
 * Get users data from Hadoop
 */
async function getUsersFromHadoop(): Promise<any[]> {
  try {
    // Check if container is running
    const { stdout: psOut } = await execPromise(`docker ps --filter name=${HADOOP_CONTAINER} --format "{{.Names}}"`);
    if (!psOut.includes(HADOOP_CONTAINER)) {
      throw new Error('Hadoop container not running');
    }
    
    // List files
    const { stdout: lsOut } = await execPromise(
      `docker exec ${HADOOP_CONTAINER} hdfs dfs -ls /user/admin/users/`
    );
    
    if (!lsOut || lsOut.includes('No such file')) {
      return [];
    }
    
    // Get latest file
    const files = lsOut.split('\n')
      .filter(line => line.includes('.csv'))
      .map(line => {
        const parts = line.trim().split(/\s+/);
        return parts[parts.length - 1];
      });
    
    if (files.length === 0) return [];
    
    // Read latest file
    const latestFile = files[files.length - 1];
    const { stdout: csvData } = await execPromise(
      `docker exec ${HADOOP_CONTAINER} hdfs dfs -cat ${latestFile}`
    );
    
    return parseCSV(csvData);
  } catch (error) {
    console.error('[Hadoop Analytics] Error fetching users:', error);
    return [];
  }
}
async function getTransactionsFromHadoop(): Promise<any[]> {
  try {
    // Check if container is running
    const { stdout: psOut } = await execPromise(`docker ps --filter name=${HADOOP_CONTAINER} --format "{{.Names}}"`);
    if (!psOut.includes(HADOOP_CONTAINER)) {
      throw new Error('Hadoop container not running');
    }
    
    // List files
    const { stdout: lsOut } = await execPromise(
      `docker exec ${HADOOP_CONTAINER} hdfs dfs -ls /user/admin/transactions/`
    );
    
    if (!lsOut || lsOut.includes('No such file')) {
      return [];
    }
    
    // Get latest file
    const files = lsOut.split('\n')
      .filter(line => line.includes('.csv'))
      .map(line => {
        const parts = line.trim().split(/\s+/);
        return parts[parts.length - 1];
      });
    
    if (files.length === 0) return [];
    
    // Read latest file
    const latestFile = files[files.length - 1];
    const { stdout: csvData } = await execPromise(
      `docker exec ${HADOOP_CONTAINER} hdfs dfs -cat ${latestFile}`
    );
    
    return parseCSV(csvData);
  } catch (error) {
    console.error('[Hadoop Analytics] Error:', error);
    return [];
  }
}

/**
 * Calculate analytics from transaction data
 */
function calculateAnalytics(transactions: any[], users: any[]) {
  if (transactions.length === 0) {
    return {
      summary: {
        total_bottles: 0,
        total_points: 0,
        avg_points_per_bottle: 0,
        unique_users: 0,
      },
      by_size: [],
      by_date: [],
      top_users: [],
    };
  }
  
  // Create user lookup map
  const userMap = new Map<string, string>();
  users.forEach(user => {
    userMap.set(user.id, user.full_name || 'Unknown User');
  });
  
  // Summary statistics
  const totalBottles = transactions.length;
  const totalPoints = transactions.reduce((sum, t) => sum + (parseInt(t.points_earned) || 0), 0);
  const avgPointsPerBottle = totalBottles > 0 ? totalPoints / totalBottles : 0;
  const uniqueUsers = new Set(transactions.map(t => t.user_id)).size;
  
  // Count by bottle size
  const sizeCount: { [key: string]: number } = {};
  transactions.forEach(t => {
    const size = t.bottle_size || 'UNKNOWN';
    sizeCount[size] = (sizeCount[size] || 0) + 1;
  });
  
  const bySize: BottleCount[] = Object.entries(sizeCount).map(([size, count]) => ({
    size,
    count,
  }));
  
  // Count by date
  const dateStats: { [key: string]: { bottles: number; points: number } } = {};
  transactions.forEach(t => {
    const date = t.created_at ? t.created_at.split(' ')[0] : 'UNKNOWN';
    if (!dateStats[date]) {
      dateStats[date] = { bottles: 0, points: 0 };
    }
    dateStats[date].bottles += 1;
    dateStats[date].points += parseInt(t.points_earned) || 0;
  });
  
  const byDate: DailyStats[] = Object.entries(dateStats)
    .map(([date, stats]) => ({
      date,
      bottles: stats.bottles,
      points: stats.points,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  // Top users with names
  const userStats: { [key: string]: { bottles: number; points: number } } = {};
  transactions.forEach(t => {
    const userId = t.user_id || 'UNKNOWN';
    if (!userStats[userId]) {
      userStats[userId] = { bottles: 0, points: 0 };
    }
    userStats[userId].bottles += 1;
    userStats[userId].points += parseInt(t.points_earned) || 0;
  });
  
  const topUsers: UserRanking[] = Object.entries(userStats)
    .map(([user_id, stats]) => ({
      user_id,
      user_name: userMap.get(user_id) || user_id.substring(0, 8) + '...',
      total_bottles: stats.bottles,
      total_points: stats.points,
    }))
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, 10);
  
  return {
    summary: {
      total_bottles: totalBottles,
      total_points: totalPoints,
      avg_points_per_bottle: Math.round(avgPointsPerBottle * 100) / 100,
      unique_users: uniqueUsers,
    },
    by_size: bySize,
    by_date: byDate,
    top_users: topUsers,
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Hadoop Analytics API] Fetching data from Hadoop...');
    
    // Get transactions and users from Hadoop
    const [transactions, users] = await Promise.all([
      getTransactionsFromHadoop(),
      getUsersFromHadoop(),
    ]);
    
    console.log(`[Hadoop Analytics API] Found ${transactions.length} transactions and ${users.length} users`);
    
    // Calculate analytics
    const analytics = calculateAnalytics(transactions, users);
    
    return NextResponse.json({
      success: true,
      data: analytics,
      metadata: {
        data_source: 'Hadoop HDFS',
        last_updated: new Date().toISOString(),
        record_count: transactions.length,
        user_count: users.length,
      },
    });
  } catch (error: any) {
    console.error('[Hadoop Analytics API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch analytics',
        data: {
          summary: {
            total_bottles: 0,
            total_points: 0,
            avg_points_per_bottle: 0,
            unique_users: 0,
          },
          by_size: [],
          by_date: [],
          top_users: [],
        },
      },
      { status: 500 }
    );
  }
}
