/**
 * Integration Tests for Nasabah (Customer) Service
 * Tests customer list and profile management
 */

import {
  getNasabahList,
  getNasabahById,
  updateNasabahProfile,
} from '@/services/nasabah.service';
import { supabase } from '@/lib/supabase';
import type { WasteUser } from '@/types/types';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Nasabah Service', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNasabahList', () => {
    it('should return empty array when no nasabah exist', async () => {
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

    it('should return error array on database error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      } as any);

      const result = await getNasabahList();
      expect(result).toEqual([]);
    });

    it('should fetch and transform nasabah list', async () => {
      const mockProfiles = [
        {
          id: 'user-1',
          full_name: 'John Doe',
          total_points: 500,
          updated_at: '2024-01-01T10:00:00Z',
          role: 'user',
        },
        {
          id: 'user-2',
          full_name: 'Jane Smith',
          total_points: 1000,
          updated_at: '2024-01-02T10:00:00Z',
          role: 'user',
        },
      ];

      const mockTransactions = [
        { user_id: 'user-1' },
        { user_id: 'user-1' },
        { user_id: 'user-2' },
      ];

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockProfiles,
                  error: null,
                }),
              }),
            }),
          } as any;
        } else if (table === 'transactions') {
          return {
            select: jest.fn().mockResolvedValue({
              data: mockTransactions,
              error: null,
            }),
          } as any;
        }
        return {} as any;
      });

      const result = await getNasabahList();
      expect(result.length).toBe(2);
      expect(result[0].nama).toBe('John Doe');
      expect(result[0].saldoPoint).toBe(500);
      expect(result[0].totalTransaksi).toBe(2);
      expect(result[1].totalTransaksi).toBe(1);
    });

    it('should only fetch users with role user (exclude admins)', async () => {
      const eqMock = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: eqMock,
        }),
      } as any);

      await getNasabahList();
      expect(eqMock).toHaveBeenCalledWith('role', 'user');
    });

    it('should handle transaction counting error gracefully', async () => {
      const mockProfiles = [
        {
          id: 'user-1',
          full_name: 'John Doe',
          total_points: 500,
          updated_at: '2024-01-01T10:00:00Z',
          role: 'user',
        },
      ];

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({
                  data: mockProfiles,
                  error: null,
                }),
              }),
            }),
          } as any;
        } else if (table === 'transactions') {
          return {
            select: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Error fetching transactions' },
            }),
          } as any;
        }
        return {} as any;
      });

      const result = await getNasabahList();
      expect(result.length).toBe(1);
      expect(result[0].totalTransaksi).toBe(0);
    });

    it('should handle exception gracefully', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Connection error');
      });

      const result = await getNasabahList();
      expect(result).toEqual([]);
    });
  });

  describe('getNasabahById', () => {
    it('should return null when nasabah not found', async () => {
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

      const result = await getNasabahById('non-existent-id');
      expect(result).toBeNull();
    });

    it('should fetch nasabah by id with transaction count', async () => {
      const mockProfile = {
        id: 'user-1',
        full_name: 'John Doe',
        total_points: 500,
        updated_at: '2024-01-01T10:00:00Z',
        role: 'user',
      };

      const mockTransactions = [
        { user_id: 'user-1' },
        { user_id: 'user-1' },
      ];

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: mockProfile,
                  error: null,
                }),
              }),
            }),
          } as any;
        } else if (table === 'transactions') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: mockTransactions,
                error: null,
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const result = await getNasabahById('user-1');
      expect(result).not.toBeNull();
      expect(result?.id).toBe('user-1');
      expect(result?.nama).toBe('John Doe');
      expect(result?.saldoPoint).toBe(500);
    });

    it('should return null on exception', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Connection error');
      });

      const result = await getNasabahById('user-1');
      expect(result).toBeNull();
    });
  });

  describe('updateNasabahProfile', () => {
    it('should update nasabah profile successfully', async () => {
      const updateData = { full_name: 'Updated Name' };
      const mockUpdatedProfile = {
        id: 'user-1',
        full_name: 'Updated Name',
        total_points: 500,
        updated_at: '2024-01-01T10:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockUpdatedProfile,
                error: null,
              }),
            }),
          }),
        }),
      } as any);

      const result = await updateNasabahProfile('user-1', updateData);
      expect(result).not.toBeNull();
      expect(result?.full_name).toBe('Updated Name');
    });

    it('should return null on update error', async () => {
      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        }),
      } as any);

      const result = await updateNasabahProfile('user-1', {
        full_name: 'New Name',
      });
      expect(result).toBeNull();
    });

    it('should handle multiple field updates', async () => {
      const updateData = {
        full_name: 'John Updated',
        total_points: 750,
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'user-1',
                  ...updateData,
                },
                error: null,
              }),
            }),
          }),
        }),
      } as any);

      const result = await updateNasabahProfile('user-1', updateData);
      expect(result).not.toBeNull();
    });
  });
});
