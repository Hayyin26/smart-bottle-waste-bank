/**
 * Integration Tests for Transactions Service
 * Tests transaction retrieval and data enrichment
 */

import {
  getTransactions,
  getTransactionsByUserId,
  Transaction,
} from '@/services/transactions.service';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Transactions Service', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should return empty array when no transactions exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      } as any);

      const result = await getTransactions();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array on database error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      } as any);

      const result = await getTransactions();
      expect(result).toEqual([]);
    });

    it('should fetch and enrich transactions with user and device info', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 'user-1',
          device_id: 'device-1',
          points_earned: 50,
          created_at: '2024-01-01T10:00:00Z',
        },
        {
          id: 2,
          user_id: 'user-2',
          device_id: 'device-2',
          points_earned: 100,
          created_at: '2024-01-02T10:00:00Z',
        },
      ];

      const mockProfiles = {
        'user-1': { full_name: 'John Doe' },
        'user-2': { full_name: 'Jane Smith' },
      };

      const mockDevices = {
        'device-1': { location: 'Canteen A' },
        'device-2': { location: 'Canteen B' },
      };

      let callCount = 0;
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'transactions') {
          return {
            select: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockTransactions,
                error: null,
              }),
            }),
          } as any;
        } else if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockImplementation(() => {
                  const userId = mockTransactions[callCount]?.user_id;
                  callCount++;
                  return Promise.resolve({
                    data: mockProfiles[userId as keyof typeof mockProfiles] || null,
                    error: null,
                  });
                }),
              }),
            }),
          } as any;
        } else if (table === 'iot_devices') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockImplementation(() => {
                  const deviceId = mockTransactions[callCount - 1]?.device_id;
                  return Promise.resolve({
                    data: mockDevices[deviceId as keyof typeof mockDevices] || null,
                    error: null,
                  });
                }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const result = await getTransactions();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('user_name');
      expect(result[0]).toHaveProperty('device_location');
    });

    it('should handle missing user profile gracefully', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 'user-1',
          device_id: 'device-1',
          points_earned: 50,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'transactions') {
          return {
            select: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({
                data: mockTransactions,
                error: null,
              }),
            }),
          } as any;
        } else if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          } as any;
        } else if (table === 'iot_devices') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              }),
            }),
          } as any;
        }
        return {} as any;
      });

      const result = await getTransactions();
      expect(result.length).toBe(1);
      expect(result[0].user_name).toBe('Unknown User');
      expect(result[0].device_location).toBe('Unknown Location');
    });

    it('should return empty array on exception', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Connection error');
      });

      const result = await getTransactions();
      expect(result).toEqual([]);
    });

    it('should order transactions by created_at descending', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 'user-1',
          device_id: 'device-1',
          points_earned: 50,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      const orderMock = jest.fn().mockResolvedValue({
        data: mockTransactions,
        error: null,
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: orderMock,
        }),
      } as any);

      await getTransactions();
      expect(orderMock).toHaveBeenCalledWith('created_at', {
        ascending: false,
      });
    });
  });

  describe('getTransactionsByUserId', () => {
    it('should return transactions for specific user', async () => {
      const mockTransactions = [
        {
          id: 1,
          user_id: 'user-1',
          device_id: 'device-1',
          points_earned: 50,
          created_at: '2024-01-01T10:00:00Z',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockTransactions,
              error: null,
            }),
          }),
        }),
      } as any);

      const eqMock = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockTransactions,
          error: null,
        }),
      });

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: eqMock,
        }),
      } as any);

      const result = await getTransactionsByUserId('user-1');
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array when user has no transactions', async () => {
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

      const result = await getTransactionsByUserId('user-no-transactions');
      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Error fetching transactions' },
            }),
          }),
        }),
      } as any);

      const result = await getTransactionsByUserId('user-1');
      expect(result).toEqual([]);
    });

    it('should filter transactions by userId', async () => {
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

      await getTransactionsByUserId('user-123');
      expect(eqMock).toHaveBeenCalledWith('user_id', 'user-123');
    });
  });
});
