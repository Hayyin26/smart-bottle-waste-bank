import { supabase } from '@/lib/supabase';
import type { WasteUser } from '@/types/types';

export async function getNasabahList(): Promise<WasteUser[]> {
  try {
    // Fetch profiles with role = 'user' only (exclude admins)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'user')
      .order('updated_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Fetch transaction counts for each user
    const { data: transactionCounts, error: transError } = await supabase
      .from('transactions')
      .select('user_id');

    if (transError) {
      console.error('Error fetching transaction counts:', transError);
    }

    // Count transactions per user
    const transCountMap: Record<string, number> = {};
    if (transactionCounts) {
      transactionCounts.forEach((t: any) => {
        transCountMap[t.user_id] = (transCountMap[t.user_id] || 0) + 1;
      });
    }

    return profiles.map((item: any) => ({
      id: item.id,
      nama: item.full_name || 'Unknown User',
      email: '', // Not available in profiles table
      nomorHp: '', // Not available in profiles table
      alamat: '', // Not available in profiles table
      kecamatan: '', // Not available in profiles table
      saldoPoint: item.total_points || 0,
      totalTransaksi: transCountMap[item.id] || 0,
      terdaftar: item.updated_at || new Date().toISOString(),
      status: 'aktif', // Default to active
    }));
  } catch (error) {
    console.error('Error in getNasabahList:', error);
    return [];
  }
}

export async function getNasabahById(id: string): Promise<WasteUser | null> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Count transactions for this user
    const { count, error: countError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    if (countError) {
      console.error('Error counting transactions:', countError);
    }

    return {
      id: profile.id,
      nama: profile.full_name || 'Unknown User',
      email: '',
      nomorHp: '',
      alamat: '',
      kecamatan: '',
      saldoPoint: profile.total_points || 0,
      totalTransaksi: count || 0,
      terdaftar: profile.updated_at || new Date().toISOString(),
      status: 'aktif',
    };
  } catch (error) {
    console.error('Error in getNasabahById:', error);
    return null;
  }
}

export async function createNasabah(nasabah: Omit<WasteUser, 'id'>): Promise<WasteUser | null> {
  try {
    // Note: profiles are auto-created by trigger when users register
    // This function is kept for compatibility but should not be used directly
    console.warn('createNasabah: Profiles are auto-created via auth trigger');
    return null;
  } catch (error) {
    console.error('Error in createNasabah:', error);
    return null;
  }
}

export async function updateNasabah(id: string, updates: Partial<WasteUser>): Promise<WasteUser | null> {
  try {
    const updateData: any = {};
    
    if (updates.nama) updateData.full_name = updates.nama;
    if (updates.saldoPoint !== undefined) updateData.total_points = updates.saldoPoint;
    // Note: email, phone, address not available in profiles table

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    // Get transaction count
    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    return {
      id: data.id,
      nama: data.full_name || 'Unknown User',
      email: '',
      nomorHp: '',
      alamat: '',
      kecamatan: '',
      saldoPoint: data.total_points || 0,
      totalTransaksi: count || 0,
      terdaftar: data.updated_at || new Date().toISOString(),
      status: 'aktif',
    };
  } catch (error) {
    console.error('Error in updateNasabah:', error);
    return null;
  }
}

export async function deleteNasabah(id: string): Promise<boolean> {
  try {
    // Note: Cannot delete profiles directly as they're linked to auth.users
    // This would require deleting the auth user first
    console.warn('deleteNasabah: Cannot delete profiles directly');
    return false;
  } catch (error) {
    console.error('Error in deleteNasabah:', error);
    return false;
  }
}
