import { supabase } from '@/lib/supabase';

export interface Transaction {
  id: number;
  user_id: string | null;
  device_id: string | null;
  points_earned: number;
  created_at: string;
  // Joined data
  user_name?: string;
  device_location?: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Fetch user names and device locations separately
    const enrichedData = await Promise.all(
      data.map(async (transaction) => {
        let userName = 'Unknown User';
        let deviceLocation = 'Unknown Location';

        // Fetch user name
        if (transaction.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', transaction.user_id)
            .single();
          
          if (profile) {
            userName = profile.full_name || 'Unknown User';
          }
        }

        // Fetch device location
        if (transaction.device_id) {
          const { data: device } = await supabase
            .from('iot_devices')
            .select('location')
            .eq('device_id', transaction.device_id)
            .single();
          
          if (device) {
            deviceLocation = device.location || 'Unknown Location';
          }
        }

        return {
          id: transaction.id,
          user_id: transaction.user_id,
          device_id: transaction.device_id,
          points_earned: transaction.points_earned,
          created_at: transaction.created_at,
          user_name: userName,
          device_location: deviceLocation,
        };
      })
    );

    return enrichedData;
  } catch (err) {
    console.error('Exception in getTransactions:', err);
    return [];
  }
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const enrichedData = await Promise.all(
      data.map(async (transaction) => {
        let userName = 'Unknown User';
        let deviceLocation = 'Unknown Location';

        if (transaction.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', transaction.user_id)
            .single();
          
          if (profile) {
            userName = profile.full_name || 'Unknown User';
          }
        }

        if (transaction.device_id) {
          const { data: device } = await supabase
            .from('iot_devices')
            .select('location')
            .eq('device_id', transaction.device_id)
            .single();
          
          if (device) {
            deviceLocation = device.location || 'Unknown Location';
          }
        }

        return {
          id: transaction.id,
          user_id: transaction.user_id,
          device_id: transaction.device_id,
          points_earned: transaction.points_earned,
          created_at: transaction.created_at,
          user_name: userName,
          device_location: deviceLocation,
        };
      })
    );

    return enrichedData;
  } catch (err) {
    console.error('Exception in getTransactionsByUserId:', err);
    return [];
  }
}

export async function getTransactionsByDeviceId(deviceId: string): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching device transactions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const enrichedData = await Promise.all(
      data.map(async (transaction) => {
        let userName = 'Unknown User';
        let deviceLocation = 'Unknown Location';

        if (transaction.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', transaction.user_id)
            .single();
          
          if (profile) {
            userName = profile.full_name || 'Unknown User';
          }
        }

        if (transaction.device_id) {
          const { data: device } = await supabase
            .from('iot_devices')
            .select('location')
            .eq('device_id', transaction.device_id)
            .single();
          
          if (device) {
            deviceLocation = device.location || 'Unknown Location';
          }
        }

        return {
          id: transaction.id,
          user_id: transaction.user_id,
          device_id: transaction.device_id,
          points_earned: transaction.points_earned,
          created_at: transaction.created_at,
          user_name: userName,
          device_location: deviceLocation,
        };
      })
    );

    return enrichedData;
  } catch (err) {
    console.error('Exception in getTransactionsByDeviceId:', err);
    return [];
  }
}

export async function createTransaction(transaction: {
  user_id: string;
  device_id: string;
  points_earned?: number;
}): Promise<Transaction | null> {
  const { data: transactionData, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: transaction.user_id,
      device_id: transaction.device_id,
      points_earned: transaction.points_earned || 10,
    })
    .select()
    .single();

  if (transactionError) {
    console.error('Error creating transaction:', transactionError);
    return null;
  }

  // Update user's total points
  const { error: updateError } = await supabase.rpc('increment_user_points', {
    user_uuid: transaction.user_id,
    points_to_add: transaction.points_earned || 10,
  });

  if (updateError) {
    console.error('Error updating user points:', updateError);
  }

  // Fetch user name and device location
  let userName = 'Unknown User';
  let deviceLocation = 'Unknown Location';

  if (transactionData.user_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', transactionData.user_id)
      .single();
    
    if (profile) {
      userName = profile.full_name || 'Unknown User';
    }
  }

  if (transactionData.device_id) {
    const { data: device } = await supabase
      .from('iot_devices')
      .select('location')
      .eq('device_id', transactionData.device_id)
      .single();
    
    if (device) {
      deviceLocation = device.location || 'Unknown Location';
    }
  }

  return {
    id: transactionData.id,
    user_id: transactionData.user_id,
    device_id: transactionData.device_id,
    points_earned: transactionData.points_earned,
    created_at: transactionData.created_at,
    user_name: userName,
    device_location: deviceLocation,
  };
}

export async function getTotalTransactions(): Promise<number> {
  const { count, error } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting transactions:', error);
    return 0;
  }

  return count || 0;
}

export async function getTotalPointsDistributed(): Promise<number> {
  const { data, error } = await supabase
    .from('transactions')
    .select('points_earned');

  if (error) {
    console.error('Error calculating total points:', error);
    return 0;
  }

  return (data || []).reduce((sum, t) => sum + t.points_earned, 0);
}

export async function getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent transactions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    const enrichedData = await Promise.all(
      data.map(async (transaction) => {
        let userName = 'Unknown User';
        let deviceLocation = 'Unknown Location';

        if (transaction.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', transaction.user_id)
            .single();
          
          if (profile) {
            userName = profile.full_name || 'Unknown User';
          }
        }

        if (transaction.device_id) {
          const { data: device } = await supabase
            .from('iot_devices')
            .select('location')
            .eq('device_id', transaction.device_id)
            .single();
          
          if (device) {
            deviceLocation = device.location || 'Unknown Location';
          }
        }

        return {
          id: transaction.id,
          user_id: transaction.user_id,
          device_id: transaction.device_id,
          points_earned: transaction.points_earned,
          created_at: transaction.created_at,
          user_name: userName,
          device_location: deviceLocation,
        };
      })
    );

    return enrichedData;
  } catch (err) {
    console.error('Exception in getRecentTransactions:', err);
    return [];
  }
}

export interface DailyActivityData {
  date: string;
  count: number;
}

export async function getWeeklyActivity(): Promise<DailyActivityData[]> {
  try {
    // Get 7 days of transaction data
    const { data, error } = await supabase
      .from('transactions')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching weekly activity:', error);
      return [];
    }

    // Group by date
    const activityMap = new Map<string, number>();
    const today = new Date();
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      activityMap.set(dateStr, 0);
    }

    // Count transactions per day
    (data || []).forEach((transaction) => {
      const date = new Date(transaction.created_at);
      const dateStr = date.toLocaleDateString('en-CA');
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    });

    // Convert to array sorted by date
    const result = Array.from(activityMap.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  } catch (err) {
    console.error('Exception in getWeeklyActivity:', err);
    return [];
  }
}

export interface DeviceActivityData {
  device_id: string;
  location: string;
  count: number;
}

export async function getTopDevicesByScans(limit: number = 5): Promise<DeviceActivityData[]> {
  try {
    // Get all devices with their transaction counts
    const { data: devices, error: devicesError } = await supabase
      .from('iot_devices')
      .select('device_id, location');

    if (devicesError) {
      console.error('Error fetching devices:', devicesError);
      return [];
    }

    // Get transaction counts per device
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('device_id');

    if (transError) {
      console.error('Error fetching transactions:', transError);
      return [];
    }

    // Count transactions per device
    const deviceCounts = new Map<string, number>();
    (transactions || []).forEach((trans) => {
      if (trans.device_id) {
        deviceCounts.set(trans.device_id, (deviceCounts.get(trans.device_id) || 0) + 1);
      }
    });

    // Combine device info with counts and sort
    const result = (devices || [])
      .map((device) => ({
        device_id: device.device_id,
        location: device.location || 'Unknown Location',
        count: deviceCounts.get(device.device_id) || 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return result;
  } catch (err) {
    console.error('Exception in getTopDevicesByScans:', err);
    return [];
  }
}
