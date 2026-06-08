/**
 * Component Tests for Authentication Guard
 * Tests protected route behavior and authentication flow
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('AuthGuard Component', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };

  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without session', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      render(
        <AuthGuard>
          <div>Dashboard Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      }, { timeout: 1000 });
    });

    it('should render children when user is authenticated on protected route', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token-123',
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      const { getByText } = render(
        <AuthGuard>
          <div>Dashboard Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(getByText('Dashboard Content')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('should protect /profile route', async () => {
      (usePathname as jest.Mock).mockReturnValue('/profile');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      render(
        <AuthGuard>
          <div>Profile Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      }, { timeout: 1000 });
    });

    it('should protect /transaksi route', async () => {
      (usePathname as jest.Mock).mockReturnValue('/transaksi');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      render(
        <AuthGuard>
          <div>Transaction Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      }, { timeout: 1000 });
    });

    it('should protect /nasabah route (admin)', async () => {
      (usePathname as jest.Mock).mockReturnValue('/nasabah');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      render(
        <AuthGuard>
          <div>Nasabah Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      }, { timeout: 1000 });
    });
  });

  describe('Public Auth Routes', () => {
    it('should redirect to dashboard when accessing /login with active session', async () => {
      (usePathname as jest.Mock).mockReturnValue('/login');
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
      };

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      } as any);

      render(
        <AuthGuard>
          <div>Login Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      }, { timeout: 1000 });
    });

    it('should allow /login access without session', async () => {
      (usePathname as jest.Mock).mockReturnValue('/login');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const { getByText } = render(
        <AuthGuard>
          <div>Login Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(getByText('Login Content')).toBeInTheDocument();
        expect(mockRouter.push).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('Public Routes', () => {
    it('should allow access to public routes without session', async () => {
      (usePathname as jest.Mock).mockReturnValue('/');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const { getByText } = render(
        <AuthGuard>
          <div>Home Content</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(getByText('Home Content')).toBeInTheDocument();
        expect(mockRouter.push).not.toHaveBeenCalled();
      }, { timeout: 1000 });
    });
  });

  describe('Error Handling', () => {
    it('should redirect to login on auth check error for protected routes', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Auth error' },
      } as any);

      render(
        <AuthGuard>
          <div>Dashboard</div>
        </AuthGuard>
      );

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login');
      }, { timeout: 1000 });
    });
  });
});
