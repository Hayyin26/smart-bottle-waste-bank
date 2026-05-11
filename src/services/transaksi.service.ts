import { supabase } from '@/lib/supabase';
import type { WasteTransaction } from '@/data/waste-transactions';
import { classifyBottle, BOTTLE_CATEGORIES } from '@/utils/bottle-classifier';

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
      
      // Get bottle type - use from DB if available, otherwise classify from weight
      let bottleType = item.bottle_type || 'KECIL';
      let bottleWeight = item.bottle_weight || 1;
      let points = item.points_earned || 10;
      
      // If bottle_type is not set but bottle_weight exists, try to classify
      if (!item.bottle_type && item.bottle_weight) {
        const classification = classifyBottle(item.bottle_weight);
        if (classification.success && classification.bottleType) {
          bottleType = classification.bottleType;
          points = classification.points || points;
        }
      }
      
      // Convert type to display name (KECIL → BOTOL KECIL, etc)
      const categoryInfo = BOTTLE_CATEGORIES[bottleType as keyof typeof BOTTLE_CATEGORIES];
      const jenisAmpah = categoryInfo?.name || `BOTOL ${bottleType}`;
      
      return {
        id: item.id.toString(),
        userId: item.user_id || '',
        userName: userMap[item.user_id] || 'Unknown User',
        jenisAmpah, // Now shows BOTOL KECIL, BOTOL SEDANG, BOTOL BESAR
        berat: bottleWeight,
        satuan: 'gram',
        nilaiTukar: points,
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
      
      // Get bottle type - use from DB if available, otherwise classify from weight
      let bottleType = item.bottle_type || 'KECIL';
      let bottleWeight = item.bottle_weight || 1;
      let points = item.points_earned || 10;
      
      // If bottle_type is not set but bottle_weight exists, try to classify
      if (!item.bottle_type && item.bottle_weight) {
        const classification = classifyBottle(item.bottle_weight);
        if (classification.success && classification.bottleType) {
          bottleType = classification.bottleType;
          points = classification.points || points;
        }
      }
      
      // Convert type to display name
      const categoryInfo = BOTTLE_CATEGORIES[bottleType as keyof typeof BOTTLE_CATEGORIES];
      const jenisAmpah = categoryInfo?.name || `BOTOL ${bottleType}`;
      
      return {
        id: item.id.toString(),
        userId: item.user_id || '',
        userName,
        jenisAmpah,
        berat: bottleWeight,
        satuan: 'gram',
        nilaiTukar: points,
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
    // Validate and classify bottle based on berat
    let bottleWeight = transaksi.berat;
    let bottleType = 'KECIL';
    let pointsToEarn = transaksi.nilaiTukar;
    
    // Auto-classify if berat is provided
    if (bottleWeight && bottleWeight > 0) {
      const classification = classifyBottle(bottleWeight);
      if (!classification.success) {
        console.error('Bottle classification failed:', classification.error);
        return null; // Return error - user must provide valid weight
      }
      bottleType = classification.bottleType || 'KECIL';
      pointsToEarn = classification.points || 10;
    }
    
    // Insert transaction with bottle info
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: transaksi.userId,
        device_id: 'manual',
        points_earned: pointsToEarn,
        bottle_weight: bottleWeight,
        bottle_type: bottleType,
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
    const categoryInfo = BOTTLE_CATEGORIES[bottleType as keyof typeof BOTTLE_CATEGORIES];
    const jenisAmpah = categoryInfo?.name || `BOTOL ${bottleType}`;
    
    return {
      id: data.id.toString(),
      userId: data.user_id,
      userName: profile?.full_name || 'Unknown User',
      jenisAmpah,
      berat: bottleWeight,
      satuan: 'gram',
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
    
    // Handle points update
    if (updates.nilaiTukar !== undefined) updateData.points_earned = updates.nilaiTukar;
    
    // Handle weight update - auto-classify if weight changed
    if (updates.berat !== undefined && updates.berat > 0) {
      const classification = classifyBottle(updates.berat);
      if (classification.success) {
        updateData.bottle_weight = updates.berat;
        updateData.bottle_type = classification.bottleType;
        updateData.points_earned = classification.points;
      }
    }

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
    const bottleType = data.bottle_type || 'KECIL';
    const categoryInfo = BOTTLE_CATEGORIES[bottleType as keyof typeof BOTTLE_CATEGORIES];
    const jenisAmpah = categoryInfo?.name || `BOTOL ${bottleType}`;
    
    return {
      id: data.id.toString(),
      userId: data.user_id,
      userName: profile?.full_name || 'Unknown User',
      jenisAmpah,
      berat: data.bottle_weight || 1,
      satuan: 'gram',
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
