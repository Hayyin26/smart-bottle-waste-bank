/**
 * Unit Tests for Nasabah Service
 * Tests user/member management functions
 */

import { getNasabahList, getNasabahById, updateNasabah } from '@/services/nasabah.service';
import * as supabaseLib from '@/lib/supabase';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// Helper to create mock Supabase chain
function createMockChain() {
  return {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  };
}

describe('Nasabah Service', () => {
  const mockSupabase = supabaseLib.supabase as jest.Mocked<typeof supabaseLib.supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNasabahList', () => {
    it('should return empty array on error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Error' },
            }),
          }),
        }),
      } as any);

      const result = await getNasabahList();
      expect(result).toEqual([]);
    });

    it('should return empty array when no profiles found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getNasabahList();
      expect(result).toEqual([]);
    });

    it('should handle transaction fetch errors gracefully', async () => {
      const mockProfiles = [
        {
          id: 'user-1',
          full_name: 'John Doe',
          total_points: 100,
          updated_at: '2024-01-01T00:00:00',
          role: 'user',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn()
          .mockReturnValueOnce({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockProfiles,
                error: null,
              }),
            }),
          } as any)
          .mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Error' },
            }),
          } as any),
      } as any);

      const result = await getNasabahList();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].totalTransaksi).toBe(0);
    });

    it('should map profile data to WasteUser correctly', async () => {
      const mockProfiles = [
        {
          id: 'user-123',
          full_name: 'Test User',
          total_points: 500,
          updated_at: '2024-01-01T00:00:00',
          role: 'user',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn()
          .mockReturnValueOnce({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockProfiles,
                error: null,
              }),
            }),
          } as any)
          .mockReturnValueOnce({
            select: jest.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          } as any),
      } as any);

      const result = await getNasabahList();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('user-123');
      expect(result[0].nama).toBe('Test User');
      expect(result[0].saldoPoint).toBe(500);
      expect(result[0].status).toBe('aktif');
    });

    it('should count transactions per user', async () => {
      const mockProfiles = [
        { id: 'user-1', full_name: 'John', total_points: 100, updated_at: '2024-01-01', role: 'user' },
      ];
      const mockTransactions = [
        { user_id: 'user-1' },
        { user_id: 'user-1' },
        { user_id: 'user-1' },
      ];

      const profileChain = createMockChain();
      profileChain.order.mockResolvedValue({ data: mockProfiles, error: null });

      const transChain = createMockChain();
      transChain.select.mockResolvedValue({ data: mockTransactions, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return transChain;
      });

      const result = await getNasabahList();
      expect(result[0].totalTransaksi).toBe(3);
    });
  });

  describe('getNasabahById', () => {
    it('should return null when profile not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      } as any);

      const result = await getNasabahById('invalid-id');
      expect(result).toBeNull();
    });

    it('should return user data when found', async () => {
      const mockProfile = {
        id: 'user-123',
        full_name: 'Jane Doe',
        total_points: 750,
        updated_at: '2024-01-15',
        role: 'user',
      };

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });

      const transChain = createMockChain();
      transChain.select.mockReturnThis();
      transChain.eq.mockResolvedValue({ count: 5, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return transChain;
      });

      const result = await getNasabahById('user-123');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-123');
      expect(result?.nama).toBe('Jane Doe');
      expect(result?.saldoPoint).toBe(750);
    });

    it('should handle transaction count error gracefully', async () => {
      const mockProfile = {
        id: 'user-123',
        full_name: 'Test User',
        total_points: 100,
        updated_at: '2024-01-01',
        role: 'user',
      };

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: mockProfile, error: null });

      const transChain = createMockChain();
      transChain.select.mockReturnThis();
      transChain.eq.mockResolvedValue({ count: undefined, error: { message: 'Count error' } });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return transChain;
      });

      const result = await getNasabahById('user-123');
      expect(result?.totalTransaksi).toBe(0);
    });
  });

  describe('updateNasabah', () => {
    it('should return null when update fails', async () => {
      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return createMockChain();
      });

      const result = await updateNasabah('user-123', { nama: 'New Name' });
      expect(result).toBeNull();
    });

    it('should update user name', async () => {
      const updatedProfile = {
        id: 'user-123',
        full_name: 'Updated Name',
        total_points: 100,
        updated_at: '2024-01-20',
        role: 'user',
      };

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: updatedProfile, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return createMockChain();
      });

      const result = await updateNasabah('user-123', { nama: 'Updated Name' });
      expect(result?.nama).toBe('Updated Name');
    });

    it('should update user points', async () => {
      const updatedProfile = {
        id: 'user-123',
        full_name: 'Test User',
        total_points: 500,
        updated_at: '2024-01-20',
        role: 'user',
      };

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: updatedProfile, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'profiles') return profileChain;
        return createMockChain();
      });

      const result = await updateNasabah('user-123', { saldoPoint: 500 });
      expect(result?.saldoPoint).toBe(500);
    });
  });
});
