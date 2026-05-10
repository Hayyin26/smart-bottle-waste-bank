import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  nomor_hp?: string;
  alamat?: string;
  kecamatan?: string;
  saldo_point: number;
  total_transaksi: number;
  role: string;
  status: string;
  auth_provider: string;
  terdaftar: string;
  updated_at: string;
}

/**
 * Get profil user saat ini
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      // Error fetching profile
      return null;
    }

    return data as UserProfile;
  } catch {
    // Handled above
  }
  return null;
}

/**
 * Update profil user
 */
export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.full_name,
      nomor_hp: updates.nomor_hp,
      alamat: updates.alamat,
      kecamatan: updates.kecamatan,
      saldo_point: updates.saldo_point,
      total_transaksi: updates.total_transaksi,
      status: updates.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    // Error updating profile
    throw new Error(error.message);
  }

  return data as UserProfile;
}

/**
 * Get profil user berdasarkan ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Error fetching user profile
      return null;
    }

    return data as UserProfile;
  } catch {
    // Handled above
  }
  return null;
}

/**
 * Get semua profil user (admin only)
 */
export async function getAllProfiles(): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      // Error fetching profiles
      return [];
    }

    return data as UserProfile[];
  } catch {
    // Handled above
  }
  return [];
}

/**
 * Delete profil user (admin only)
 */
export async function deleteUserProfile(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      // Error deleting profile
      return false;
    }

    return true;
  } catch {
    // Handled above
  }
  return false;
}
