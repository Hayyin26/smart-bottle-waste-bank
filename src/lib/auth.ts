import { supabase } from './supabase';

/**
 * Login dengan Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(`Google sign-in failed: ${error.message}`);
  }

  return data;
}

/**
 * Login dengan GitHub OAuth
 */
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(`GitHub sign-in failed: ${error.message}`);
  }

  return data;
}

/**
 * Login dengan email & password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Email sign-in failed: ${error.message}`);
  }

  return data;
}

/**
 * Register dengan email & password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    // Improve error messages
    if (error.message.includes('already registered') || error.message.includes('User already exists')) {
      throw new Error('Email ini sudah terdaftar. Silakan gunakan email lain atau coba login.');
    } else if (error.message.includes('password')) {
      throw new Error('Password tidak memenuhi kriteria keamanan. Minimal 8 karakter.');
    }
    throw new Error(`Sign-up failed: ${error.message}`);
  }

  return data;
}

/**
 * Logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(`Sign-out failed: ${error.message}`);
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Get user failed: ${error.message}`);
  }

  return user;
}
