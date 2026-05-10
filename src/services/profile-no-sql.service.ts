/**
 * Profile Service - Alternative tanpa SQL Migration
 * Menggunakan existing profiles table + localStorage untuk extended data
 */

import { supabase } from '@/lib/supabase';

export interface UserProfileDetail {
  // Required fields (dari profiles table)
  id: string;
  full_name: string;
  role: string;
  total_points: number;

  // Extended fields (disimpan di localStorage + preferences table)
  email?: string;
  nomor_hp?: string;
  alamat?: string;
  kecamatan?: string;
  saldo_point?: number;
  total_transaksi?: number;
  auth_provider?: string;
}

/**
 * Get current user profile (dari auth + profiles table)
 */
export async function getCurrentUserProfile(): Promise<UserProfileDetail | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get dari profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    // Get extended data dari localStorage
    const extendedData = localStorage.getItem(`profile_${user.id}`);
    const parsedExtendedData = extendedData ? JSON.parse(extendedData) : {};

    return {
      ...profile,
      email: user.email,
      auth_provider: user.app_metadata?.provider || 'email',
      ...parsedExtendedData,
    } as UserProfileDetail;
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error);
    return null;
  }
}

/**
 * Update basic profile (full_name) - ke database
 */
export async function updateBasicProfile(updates: {
  full_name?: string;
}): Promise<UserProfileDetail | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Update di profiles table
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.full_name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const profile = await getCurrentUserProfile();
    return profile;
  } catch (error) {
    console.error('Error in updateBasicProfile:', error);
    throw error;
  }
}

/**
 * Update extended profile data - ke localStorage + optional backend
 * (Data ini tidak persistent di DB, tapi tersimpan di localStorage)
 */
export async function updateExtendedProfile(updates: {
  nomor_hp?: string;
  alamat?: string;
  kecamatan?: string;
  saldo_point?: number;
  total_transaksi?: number;
}): Promise<UserProfileDetail | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Simpan extended data ke localStorage
    const existingData = localStorage.getItem(`profile_${user.id}`);
    const currentData = existingData ? JSON.parse(existingData) : {};
    
    const newData = {
      ...currentData,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(`profile_${user.id}`, JSON.stringify(newData));

    // Optional: Simpan juga ke Supabase (preferences table atau lainnya)
    // Ini untuk backup jika ingin persistent di server
    await saveExtendedProfileToSupabase(user.id, newData);

    // Return updated profile
    const profile = await getCurrentUserProfile();
    return profile;
  } catch (error) {
    console.error('Error in updateExtendedProfile:', error);
    throw error;
  }
}

/**
 * Backup extended profile ke Supabase (optional)
 * Ini simpan ke `profiles` table di `raw_user_meta_data` atau user metadata
 */
async function saveExtendedProfileToSupabase(userId: string, data: any) {
  try {
    // Option 1: Simpan ke user metadata (via admin API)
    // Ini perlu service key, skip untuk sekarang

    // Option 2: Simpan ke profiles table kolom `raw_data` (jika ditambah)
    // Juga skip karena tidak ada SQL migration

    // For now, just localStorage is enough
    console.log('Extended profile saved to localStorage');
  } catch (error) {
    console.warn('Could not save extended profile to backend:', error);
    // Don't throw, localStorage is enough
  }
}

/**
 * Sync profile data (call this setiap kali user login)
 */
export async function syncProfileData(): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && !localStorage.getItem(`profile_${user.id}`)) {
      // Initialize profile data di localStorage
      localStorage.setItem(
        `profile_${user.id}`,
        JSON.stringify({
          nomor_hp: '',
          alamat: '',
          kecamatan: '',
          saldo_point: 0,
          total_transaksi: 0,
          updated_at: new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    console.error('Error syncing profile:', error);
  }
}

/**
 * Clear profile data dari localStorage (saat logout)
 */
export function clearProfileData(userId?: string): void {
  try {
    if (userId) {
      // Jika userId provided, langsung clear
      localStorage.removeItem(`profile_${userId}`);
    } else {
      // Jika tidak, ambil dari current user
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          localStorage.removeItem(`profile_${user.id}`);
        }
      });
    }
  } catch (error) {
    console.error('Error clearing profile:', error);
  }
}
