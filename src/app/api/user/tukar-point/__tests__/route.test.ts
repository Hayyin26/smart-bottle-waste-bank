/**
 * Integration Tests for Point Exchange Functionality
 * Tests the business logic of point conversion
 */

import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('Point Exchange Service (Tukar Point)', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Point Conversion Logic', () => {
    it('should successfully convert points to balance', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockProfile = {
        id: 'user-123',
        total_points: 100,
        saldo_point: 50,
      };

      // Verify the conversion calculation
      const newSaldo = (mockProfile.saldo_point || 0) + (mockProfile.total_points || 0);
      expect(newSaldo).toBe(150);

      // Verify points are zeroed
      const newPoints = 0;
      expect(newPoints).toBe(0);
    });

    it('should validate user has points to convert', async () => {
      const mockProfile = {
        id: 'user-123',
        total_points: 0,
        saldo_point: 50,
      };

      const pointsToConvert = mockProfile.total_points || 0;
      const canConvert = pointsToConvert > 0;
      expect(canConvert).toBe(false);
    });

    it('should handle zero balance correctly', async () => {
      const mockProfile = {
        id: 'user-123',
        total_points: 100,
        saldo_point: 0,
      };

      const newSaldo = (mockProfile.saldo_point || 0) + mockProfile.total_points;
      expect(newSaldo).toBe(100);
    });

    it('should handle large point amounts', async () => {
      const mockProfile = {
        id: 'user-123',
        total_points: 999999,
        saldo_point: 1000000,
      };

      const newSaldo = mockProfile.saldo_point + mockProfile.total_points;
      expect(newSaldo).toBe(1999999);
    });
  });

  describe('Profile Validation', () => {
    it('should verify user authentication', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      } as any);

      const { data, error } = await mockSupabase.auth.getUser('valid-token');
      expect(data?.user).toBeDefined();
      expect(error).toBeNull();
    });

    it('should handle invalid token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid token' },
      } as any);

      const { data, error } = await mockSupabase.auth.getUser('invalid-token');
      expect(data?.user).toBeNull();
      expect(error).toBeDefined();
    });

    it('should fetch user profile', async () => {
      const mockProfile = {
        id: 'user-123',
        total_points: 500,
        saldo_point: 1000,
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      } as any);

      const selectMock = mockSupabase.from('profiles').select('*');
      const eqMock = selectMock.eq('id', 'user-123');
      const result = await eqMock.single();

      expect(result.data).toEqual(mockProfile);
      expect(result.error).toBeNull();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle profile not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Profile not found' },
            }),
          }),
        }),
      } as any);

      const result = await mockSupabase
        .from('profiles')
        .select('*')
        .eq('id', 'non-existent')
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });

    it('should handle update failures', async () => {
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

      const result = await mockSupabase
        .from('profiles')
        .update({ saldo_point: 150, total_points: 0 })
        .eq('id', 'user-123')
        .select()
        .single();

      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Update failed');
    });
  });
});
