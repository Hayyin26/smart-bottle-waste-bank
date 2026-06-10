import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'user';
  total_points: number;
  updated_at: string;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('total_points', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }

  return data || [];
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

export async function getTopUsers(limit: number = 10): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'user')
    .order('total_points', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top users:', error);
    return [];
  }

  return data || [];
}

export async function getTotalUsers(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting users:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return 0;
    }

    console.log('Total users count:', count);
    return count || 0;
  } catch (err) {
    console.error('Exception in getTotalUsers:', err);
    return 0;
  }
}
