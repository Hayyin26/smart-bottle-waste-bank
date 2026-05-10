"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { syncProfileData } from '@/services/profile-no-sql.service';

/**
 * Komponen untuk menangani OAuth callback
 * URL ini akan dipanggil setelah user login dengan Google atau GitHub
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase akan otomatis menangani callback
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User berhasil login
          const user = session.user;
          
          // Cek apakah profile sudah ada
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

          // Jika profile tidak ada, trigger akan auto-create saat auth user dibuat
          // Tapi untuk update info, kita lakukan update di sini
          if (existingProfile) {
            // Update profil dengan data terbaru dari auth session
            await supabase
              .from('profiles')
              .update({
                full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                updated_at: new Date().toISOString(),
              })
              .eq('id', user.id);
          }

          // Sync profile data ke localStorage
          await syncProfileData();

          // Redirect ke dashboard
          router.push('/dashboard');
        } else {
          // Session belum tersedia, tunggu sebentar lalu cek lagi
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
        <p className="text-slate-600">Memproses login Anda...</p>
      </div>
    </div>
  );
}
