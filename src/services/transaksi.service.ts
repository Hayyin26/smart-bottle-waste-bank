import { supabase } from '@/lib/supabase';
import type { WasteTransaction } from '@/data/waste-transactions';

export async function getTransaksiList(): Promise<WasteTransaction[]> {
  try {
    // Fetch transactions
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Get unique user IDs
    const userIds = [...new Set(transactions.map((t: any) => t.user_id).filter(Boolean))];

    // Fetch user names
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds);

    const userMap: Record<string, string> = {};
    if (profiles) {
      profiles.forEach((p: any) => {
        userMap[p.id] = p.full_name || 'Unknown User';
      });
    }

    // Map to WasteTransaction format
    return transactions.map((item: any) => {
      const createdAt = new Date(item.created_at);
      return {
        id: item.id.toString(),
        userId: item.user_id || '',
        userName: userMap[item.user_id] || 'Unknown User',
        jenisAmpah: 'Sampah Umum', // Default since we don't have waste type in transactions table
        berat: 1, // Default weight
        satuan: 'kg',
        nilaiTukar: item.points_earned || 10,
        tanggal: createdAt.toISOString().split('T')[0],
        waktu: createdAt.toTimeString().split(' ')[0],
        status: 'selesai' as const,
      };
    });
  } catch (error) {
    console.error('Error in getTransaksiList:', error);
    return [];
  }
}

export async function getTransaksiByUserId(userId: string): Promise<WasteTransaction[]> {
  try {
    // Fetch transactions for user
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Fetch user name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single();

    const userName = profile?.full_name || 'Unknown User';

    return transactions.map((item: any) => {
      const createdAt = new Date(item.created_at);
      return {
        id: item.id.toString(),
        userId: item.user_id || '',
        userName,
        jenisAmpah: 'Sampah Umum',
        berat: 1,
        satuan: 'kg',
        nilaiTukar: item.points_earned || 10,
        tanggal: createdAt.toISOString().split('T')[0],
        waktu: createdAt.toTimeString().split(' ')[0],
        status: 'selesai' as const,
      };
    });
  } catch (error) {
    console.error('Error in getTransaksiByUserId:', error);
    return [];
  }
}

export async function createTransaksi(transaksi: Omit<WasteTransaction, 'id' | 'userName'>): Promise<WasteTransaction | null> {
  try {
    // Note: Transactions are created by IoT system
    // This function is kept for compatibility but creates a basic transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaksi.userId,
        device_id: 'manual', // Default device for manual transactions
        points_earned: transaksi.nilaiTukar,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return null;
    }

    // Fetch user name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', transaksi.userId)
      .single();

    const createdAt = new Date(data.created_at);
    return {
      id: data.id.toString(),
      userId: data.user_id,
      userName: profile?.full_name || 'Unknown User',
      jenisAmpah: transaksi.jenisAmpah,
      berat: transaksi.berat,
      satuan: transaksi.satuan,
      nilaiTukar: data.points_earned,
      tanggal: createdAt.toISOString().split('T')[0],
      waktu: createdAt.toTimeString().split(' ')[0],
      status: 'selesai' as const,
    };
  } catch (error) {
    console.error('Error in createTransaksi:', error);
    return null;
  }
}

export async function updateTransaksi(id: string, updates: Partial<WasteTransaction>): Promise<WasteTransaction | null> {
  try {
    const updateData: any = {};
    
    if (updates.nilaiTukar !== undefined) updateData.points_earned = updates.nilaiTukar;
    // Note: Other fields not available in transactions table

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return null;
    }

    // Fetch user name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', data.user_id)
      .single();

    const createdAt = new Date(data.created_at);
    return {
      id: data.id.toString(),
      userId: data.user_id,
      userName: profile?.full_name || 'Unknown User',
      jenisAmpah: updates.jenisAmpah || 'Sampah Umum',
      berat: updates.berat || 1,
      satuan: updates.satuan || 'kg',
      nilaiTukar: data.points_earned,
      tanggal: createdAt.toISOString().split('T')[0],
      waktu: createdAt.toTimeString().split(' ')[0],
      status: 'selesai' as const,
    };
  } catch (error) {
    console.error('Error in updateTransaksi:', error);
    return null;
  }
}

export async function deleteTransaksi(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Error deleting transaction:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTransaksi:', error);
    return false;
  }
}
