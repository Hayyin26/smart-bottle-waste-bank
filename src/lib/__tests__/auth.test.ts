/**
 * Unit Tests for Authentication Service
 * Tests login, logout, and user retrieval functions
 */

import {
  signInWithEmail,
  signOut,
  getCurrentUser,
} from '@/lib/auth';
import * as supabaseLib from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

describe('Authentication Service', () => {
  const mockSupabase = supabaseLib.supabase as jest.Mocked<typeof supabaseLib.supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signInWithEmail', () => {
    it('should return user data on successful login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
      };

      const mockSession = {
        user: mockUser,
        access_token: 'token-123',
        refresh_token: 'refresh-123',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockSession as any,
        error: null,
      } as any);

      const result = await signInWithEmail('test@example.com', 'password123');
      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error on invalid credentials', async () => {
      const mockError = {
        message: 'Invalid login credentials',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError as any,
      } as any);

      await expect(
        signInWithEmail('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Email sign-in failed');
    });

    it('should throw error with proper message', async () => {
      const mockError = {
        message: 'User not found',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError as any,
      } as any);

      await expect(
        signInWithEmail('nonexistent@example.com', 'password')
      ).rejects.toThrow('Email sign-in failed: User not found');
    });

    it('should call signInWithPassword with correct parameters', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'token-123',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: mockSession as any,
        error: null,
      } as any);

      await signInWithEmail('test@example.com', 'password123');

      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network error',
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: mockError as any,
      } as any);

      await expect(
        signInWithEmail('test@example.com', 'password123')
      ).rejects.toThrow('Network error');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      } as any);

      await expect(signOut()).resolves.toBeUndefined();
    });

    it('should throw error on sign out failure', async () => {
      const mockError = {
        message: 'Sign out failed',
      };

      mockSupabase.auth.signOut.mockResolvedValue({
        error: mockError as any,
      } as any);

      await expect(signOut()).rejects.toThrow(
        'Sign-out failed: Sign out failed'
      );
    });

    it('should call Supabase signOut method', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({
        error: null,
      } as any);

      await signOut();
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {},
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      } as any);

      const result = await getCurrentUser();
      expect(result?.id).toBe('user-123');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when no user is authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      } as any);

      const result = await getCurrentUser();
      expect(result).toBeNull();
    });

    it('should throw error on fetch failure', async () => {
      const mockError = {
        message: 'Failed to get user',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError as any,
      } as any);

      await expect(getCurrentUser()).rejects.toThrow(
        'Get user failed: Failed to get user'
      );
    });

    it('should handle authentication token errors', async () => {
      const mockError = {
        message: 'Invalid token',
      };

      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError as any,
      } as any);

      await expect(getCurrentUser()).rejects.toThrow('Invalid token');
    });
  });

  describe('Error handling', () => {
    it('should properly format error messages', async () => {
      const testCases = [
        { message: 'Invalid credentials' },
        { message: 'User not found' },
        { message: 'Network error' },
      ];

      for (const errorCase of testCases) {
        mockSupabase.auth.signInWithPassword.mockResolvedValue({
          data: null,
          error: errorCase as any,
        } as any);

        await expect(
          signInWithEmail('test@example.com', 'password')
        ).rejects.toThrow(`Email sign-in failed: ${errorCase.message}`);
      }
    });
  });
});
