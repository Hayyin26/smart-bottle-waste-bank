import { supabase } from '@/lib/supabase';
import type { WasteType } from '@/data/waste-transactions';

export async function getJenisSampahList(): Promise<WasteType[]> {
  const { data, error } = await supabase
    .from('jenis_sampah')
    .select('*')
    .order('nama', { ascending: true });

  if (error) {
    console.error('Error fetching jenis sampah:', error);
    return [];
  }

  return data.map((item) => ({
    id: item.id,
    nama: item.nama,
    hargaPerKg: item.harga_per_kg,
    icon: item.icon,
    warna: item.warna,
  }));
}

export async function getJenisSampahById(id: string): Promise<WasteType | null> {
  const { data, error } = await supabase
    .from('jenis_sampah')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching jenis sampah:', error);
    return null;
  }

  return {
    id: data.id,
    nama: data.nama,
    hargaPerKg: data.harga_per_kg,
    icon: data.icon,
    warna: data.warna,
  };
}

export async function createJenisSampah(jenisSampah: Omit<WasteType, 'id'>): Promise<WasteType | null> {
  const { data, error } = await supabase
    .from('jenis_sampah')
    .insert({
      nama: jenisSampah.nama,
      harga_per_kg: jenisSampah.hargaPerKg,
      icon: jenisSampah.icon,
      warna: jenisSampah.warna,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating jenis sampah:', error);
    return null;
  }

  return {
    id: data.id,
    nama: data.nama,
    hargaPerKg: data.harga_per_kg,
    icon: data.icon,
    warna: data.warna,
  };
}

export async function updateJenisSampah(id: string, updates: Partial<WasteType>): Promise<WasteType | null> {
  const updateData: any = {};
  
  if (updates.nama) updateData.nama = updates.nama;
  if (updates.hargaPerKg !== undefined) updateData.harga_per_kg = updates.hargaPerKg;
  if (updates.icon) updateData.icon = updates.icon;
  if (updates.warna) updateData.warna = updates.warna;

  const { data, error } = await supabase
    .from('jenis_sampah')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating jenis sampah:', error);
    return null;
  }

  return {
    id: data.id,
    nama: data.nama,
    hargaPerKg: data.harga_per_kg,
    icon: data.icon,
    warna: data.warna,
  };
}

export async function deleteJenisSampah(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('jenis_sampah')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting jenis sampah:', error);
    return false;
  }

  return true;
}
