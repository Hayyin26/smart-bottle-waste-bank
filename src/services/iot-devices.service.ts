import { supabase } from '@/lib/supabase';

export interface IoTDevice {
  device_id: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
}

export async function getDevices(): Promise<IoTDevice[]> {
  const { data, error } = await supabase
    .from('iot_devices')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching devices:', error);
    return [];
  }

  return data || [];
}

export async function getActiveDevices(): Promise<IoTDevice[]> {
  const { data, error } = await supabase
    .from('iot_devices')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active devices:', error);
    return [];
  }

  return data || [];
}

export async function getDeviceById(deviceId: string): Promise<IoTDevice | null> {
  const { data, error } = await supabase
    .from('iot_devices')
    .select('*')
    .eq('device_id', deviceId)
    .single();

  if (error) {
    console.error('Error fetching device:', error);
    return null;
  }

  return data;
}

export async function createDevice(device: Omit<IoTDevice, 'created_at'>): Promise<IoTDevice | null> {
  const { data, error } = await supabase
    .from('iot_devices')
    .insert(device)
    .select()
    .single();

  if (error) {
    console.error('Error creating device:', error);
    return null;
  }

  return data;
}

export async function updateDevice(deviceId: string, updates: Partial<IoTDevice>): Promise<IoTDevice | null> {
  const { data, error } = await supabase
    .from('iot_devices')
    .update(updates)
    .eq('device_id', deviceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating device:', error);
    return null;
  }

  return data;
}

export async function deleteDevice(deviceId: string): Promise<boolean> {
  const { error } = await supabase
    .from('iot_devices')
    .delete()
    .eq('device_id', deviceId);

  if (error) {
    console.error('Error deleting device:', error);
    return false;
  }

  return true;
}

export async function getTotalDevices(): Promise<number> {
  const { count, error } = await supabase
    .from('iot_devices')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting devices:', error);
    return 0;
  }

  return count || 0;
}
