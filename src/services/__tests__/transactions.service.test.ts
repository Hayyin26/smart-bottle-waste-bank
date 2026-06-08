/**
 * Unit Tests for Transactions Service
 * Tests transaction fetching and filtering functions
 */

import {
  getTransactions,
  getTransactionsByUserId,
  type Transaction,
} from '@/services/transactions.service';
import * as supabaseLib from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
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

describe('Transactions Service', () => {
  const mockSupabase = supabaseLib.supabase as jest.Mocked<typeof supabaseLib.supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    it('should return empty array on fetch error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Fetch error' },
          }),
        }),
      } as any);

      const result = await getTransactions();
      expect(result).toEqual([]);
    });

    it('should return empty array when no transactions found', async () => {
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
    });

    it('should return transactions with enriched data', async () => {
      const mockTransaction = {
        id: 1,
        user_id: 'user-1',
        device_id: 'device-1',
        points_earned: 10,
        created_at: '2024-01-01T10:00:00',
      };

      // Setup transaction query
      const transChain = createMockChain();
      transChain.order.mockResolvedValue({
        data: [mockTransaction],
        error: null,
      });

      // Setup profile query
      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({
        data: { full_name: 'John Doe' },
        error: null,
      });

      // Setup device query
      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({
        data: { location: 'Kantor Pusat' },
        error: null,
      });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactions();
      expect(result).toHaveLength(1);
      expect(result[0].user_name).toBe('John Doe');
      expect(result[0].device_location).toBe('Kantor Pusat');
    });

    it('should handle missing user profile gracefully', async () => {
      const mockTransaction = {
        id: 1,
        user_id: 'user-1',
        device_id: 'device-1',
        points_earned: 10,
        created_at: '2024-01-01T10:00:00',
      };

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: [mockTransaction], error: null });

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: { location: 'Kantor Pusat' }, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactions();
      expect(result[0].user_name).toBe('Unknown User');
    });

    it('should handle missing device data gracefully', async () => {
      const mockTransaction = {
        id: 1,
        user_id: 'user-1',
        device_id: 'device-1',
        points_earned: 10,
        created_at: '2024-01-01T10:00:00',
      };

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: [mockTransaction], error: null });

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: { full_name: 'John Doe' }, error: null });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: null, error: { message: 'Not found' } });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactions();
      expect(result[0].device_location).toBe('Unknown Location');
    });

    it('should handle transactions without user_id', async () => {
      const mockTransaction = {
        id: 1,
        user_id: null,
        device_id: 'device-1',
        points_earned: 10,
        created_at: '2024-01-01T10:00:00',
      };

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: [mockTransaction], error: null });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: { location: 'Kantor Pusat' }, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        return deviceChain;
      });

      const result = await getTransactions();
      expect(result[0].user_name).toBe('Unknown User');
    });

    it('should preserve transaction data in result', async () => {
      const mockTransaction = {
        id: 42,
        user_id: 'user-123',
        device_id: 'device-456',
        points_earned: 15,
        created_at: '2024-02-15T14:30:00',
      };

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: [mockTransaction], error: null });

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: { full_name: 'User' }, error: null });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: { location: 'Location' }, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactions();
      expect(result[0].id).toBe(42);
      expect(result[0].user_id).toBe('user-123');
      expect(result[0].device_id).toBe('device-456');
      expect(result[0].points_earned).toBe(15);
      expect(result[0].created_at).toBe('2024-02-15T14:30:00');
    });
  });

  describe('getTransactionsByUserId', () => {
    it('should return empty array on fetch error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Fetch error' },
            }),
          }),
        }),
      } as any);

      const result = await getTransactionsByUserId('user-1');
      expect(result).toEqual([]);
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

      const result = await getTransactionsByUserId('user-1');
      expect(result).toEqual([]);
    });

    it('should return only transactions for specified user', async () => {
      const mockTransactions = [
        { id: 1, user_id: 'user-1', device_id: 'device-1', points_earned: 10, created_at: '2024-01-01T10:00:00' },
        { id: 2, user_id: 'user-1', device_id: 'device-2', points_earned: 15, created_at: '2024-01-02T10:00:00' },
      ];

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: mockTransactions, error: null });

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: { full_name: 'John Doe' }, error: null });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: { location: 'Location' }, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactionsByUserId('user-1');
      expect(result).toHaveLength(2);
    });

    it('should filter transactions correctly when called with userId', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockImplementation((field, value) => {
            expect(field).toBe('user_id');
            expect(value).toBe('specific-user');
            return {
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            };
          }),
        }),
      } as any);

      await getTransactionsByUserId('specific-user');
      expect(mockSupabase.from).toHaveBeenCalledWith('transactions');
    });

    it('should order transactions by created_at descending', async () => {
      const mockTransactions = [
        { id: 1, user_id: 'user-1', device_id: 'device-1', points_earned: 10, created_at: '2024-01-03T10:00:00' },
        { id: 2, user_id: 'user-1', device_id: 'device-2', points_earned: 15, created_at: '2024-01-01T10:00:00' },
      ];

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: mockTransactions, error: null });

      const profileChain = createMockChain();
      profileChain.single.mockResolvedValue({ data: { full_name: 'User' }, error: null });

      const deviceChain = createMockChain();
      deviceChain.single.mockResolvedValue({ data: { location: 'Location' }, error: null });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        if (table === 'profiles') return profileChain;
        return deviceChain;
      });

      const result = await getTransactionsByUserId('user-1');
      expect(result[0].created_at).toBe('2024-01-03T10:00:00');
    });

    it('should handle enrichment errors gracefully', async () => {
      const mockTransaction = {
        id: 1,
        user_id: 'user-1',
        device_id: 'device-1',
        points_earned: 10,
        created_at: '2024-01-01T10:00:00',
      };

      const transChain = createMockChain();
      transChain.order.mockResolvedValue({ data: [mockTransaction], error: null });

      const errorChain = createMockChain();
      errorChain.single.mockResolvedValue({ data: null, error: { message: 'Error' } });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'transactions') return transChain;
        return errorChain;
      });

      const result = await getTransactionsByUserId('user-1');
      expect(result[0].user_name).toBe('Unknown User');
      expect(result[0].device_location).toBe('Unknown Location');
    });
  });

  describe('Transaction interface validation', () => {
    it('should have correct Transaction interface structure', () => {
      const transaction: Transaction = {
        id: 1,
        user_id: 'user-123',
        device_id: 'device-456',
        points_earned: 10,
        created_at: '2024-01-01T00:00:00',
        user_name: 'John Doe',
        device_location: 'Office',
      };

      expect(transaction).toHaveProperty('id');
      expect(transaction).toHaveProperty('user_id');
      expect(transaction).toHaveProperty('device_id');
      expect(transaction).toHaveProperty('points_earned');
      expect(transaction).toHaveProperty('created_at');
      expect(transaction).toHaveProperty('user_name');
      expect(transaction).toHaveProperty('device_location');
    });
  });
});
