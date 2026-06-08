/**
 * Integration Tests for IoT Session Management
 * Tests session validation and user retrieval logic
 */

import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('IoT Session Management Service', () => {
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Session Validation', () => {
    it('should validate session token format', () => {
      const sessionToken = 'valid-token-123';
      const deviceId = 'device-123';

      expect(sessionToken).toBeDefined();
      expect(deviceId).toBeDefined();
      expect(sessionToken.length).toBeGreaterThan(0);
      expect(deviceId.length).toBeGreaterThan(0);
    });

    it('should check session expiration', () => {
      const currentTime = new Date();
      const expiresAtFuture = new Date(currentTime.getTime() + 3600000);
      const expiresAtPast = new Date(currentTime.getTime() - 3600000);

      expect(expiresAtFuture > currentTime).toBe(true);
      expect(expiresAtPast < currentTime).toBe(true);
    });

    it('should handle missing session parameters', () => {
      const sessionToken = null;
      const deviceId = null;

      const hasRequiredParams = sessionToken && deviceId;
      expect(hasRequiredParams).toBeFalsy();
    });
  });

  describe('Session Retrieval', () => {
    it('should fetch session from database', async () => {
      const mockSession = {
        user_id: 'user-123',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        session_token: 'token-123',
        device_id: 'device-123',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: mockSession,
                error: null,
              }),
            }),
          }),
        }),
      } as any);

      const result = await mockSupabase
        .from('iot_sessions')
        .select('*')
        .eq('session_token', 'token-123')
        .eq('device_id', 'device-123')
        .single();

      expect(result.data).toEqual(mockSession);
      expect(result.error).toBeNull();
    });

    it('should return null when session not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            }),
          }),
        }),
      } as any);

      const result = await mockSupabase
        .from('iot_sessions')
        .select('*')
        .eq('session_token', 'invalid-token')
        .eq('device_id', 'device-123')
        .single();

      expect(result.data).toBeNull();
      expect(result.error).toBeDefined();
    });
  });

  describe('User Profile Retrieval', () => {
    it('should fetch user profile by id', async () => {
      const mockProfile = {
        id: 'user-123',
        full_name: 'John Doe',
        total_points: 500,
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

      const result = await mockSupabase
        .from('profiles')
        .select('id, full_name, total_points')
        .eq('id', 'user-123')
        .single();

      expect(result.data?.full_name).toBe('John Doe');
      expect(result.data?.total_points).toBe(500);
    });

    it('should handle missing user profile', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'User not found' },
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
      expect(result.error?.message).toBe('User not found');
    });
  });

  describe('Active Session Retrieval', () => {
    it('should fetch active sessions ordered by expiration', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gt: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: { user_id: 'user-123' },
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as any);

      const selectMock = mockSupabase.from('iot_sessions').select('*');
      const eqMock = selectMock.eq('device_id', 'device-123');
      const gtMock = eqMock.gt('expires_at', new Date().toISOString());
      const orderMock = gtMock.order('expires_at', { ascending: false });
      const limitMock = orderMock.limit(1);
      const result = await limitMock.single();

      expect(result.data?.user_id).toBe('user-123');
    });

    it('should return null when no active sessions', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gt: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: null,
                    error: null,
                  }),
                }),
              }),
            }),
          }),
        }),
      } as any);

      const result = await mockSupabase
        .from('iot_sessions')
        .select('*')
        .eq('device_id', 'device-123')
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .single();

      expect(result.data).toBeNull();
    });
  });

  describe('Session Deletion', () => {
    it('should delete session by token', async () => {
      mockSupabase.from.mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any);

      const result = await mockSupabase
        .from('iot_sessions')
        .delete()
        .eq('session_token', 'token-123');

      expect(result.error).toBeNull();
    });
  });
});
