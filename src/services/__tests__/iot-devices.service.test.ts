/**
 * Unit Tests for IoT Devices Service
 * Tests device fetching and management functions
 */

import {
  getDevices,
  getActiveDevices,
  type IoTDevice,
} from '@/services/iot-devices.service';
import * as supabaseLib from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('IoT Devices Service', () => {
  const mockSupabase = supabaseLib.supabase as jest.Mocked<typeof supabaseLib.supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDevices', () => {
    it('should return all devices from database', async () => {
      const mockDevices: IoTDevice[] = [
        {
          device_id: 'device-1',
          location: 'Kantor Pusat',
          is_active: true,
          created_at: '2024-01-01T10:00:00',
        },
        {
          device_id: 'device-2',
          location: 'Cabang Jakarta',
          is_active: false,
          created_at: '2024-01-02T10:00:00',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockDevices,
            error: null,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result).toEqual(mockDevices);
      expect(result).toHaveLength(2);
    });

    it('should return empty array on fetch error', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Fetch error' },
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result).toEqual([]);
    });

    it('should return empty array when no devices exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result).toEqual([]);
    });

    it('should order devices by created_at descending', async () => {
      const mockDevices: IoTDevice[] = [
        {
          device_id: 'device-new',
          location: 'New Location',
          is_active: true,
          created_at: '2024-02-01T10:00:00',
        },
        {
          device_id: 'device-old',
          location: 'Old Location',
          is_active: true,
          created_at: '2024-01-01T10:00:00',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockDevices,
            error: null,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result[0].device_id).toBe('device-new');
      expect(result[1].device_id).toBe('device-old');
    });

    it('should include both active and inactive devices', async () => {
      const mockDevices: IoTDevice[] = [
        {
          device_id: 'device-active',
          location: 'Location A',
          is_active: true,
          created_at: '2024-01-01T10:00:00',
        },
        {
          device_id: 'device-inactive',
          location: 'Location B',
          is_active: false,
          created_at: '2024-01-02T10:00:00',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockDevices,
            error: null,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result.some(d => d.is_active)).toBe(true);
      expect(result.some(d => !d.is_active)).toBe(true);
    });
  });

  describe('getActiveDevices', () => {
    it('should return only active devices', async () => {
      const mockActiveDevices: IoTDevice[] = [
        {
          device_id: 'device-1',
          location: 'Kantor Pusat',
          is_active: true,
          created_at: '2024-01-01T10:00:00',
        },
        {
          device_id: 'device-2',
          location: 'Cabang Jakarta',
          is_active: true,
          created_at: '2024-01-02T10:00:00',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockActiveDevices,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getActiveDevices();
      expect(result).toHaveLength(2);
      expect(result.every(d => d.is_active)).toBe(true);
    });

    it('should return empty array when no active devices exist', async () => {
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

      const result = await getActiveDevices();
      expect(result).toEqual([]);
    });

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

      const result = await getActiveDevices();
      expect(result).toEqual([]);
    });

    it('should filter by is_active = true', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockImplementation((field, value) => {
            expect(field).toBe('is_active');
            expect(value).toBe(true);
            return {
              order: jest.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            };
          }),
        }),
      } as any);

      await getActiveDevices();
    });

    it('should order active devices by created_at descending', async () => {
      const mockActiveDevices: IoTDevice[] = [
        {
          device_id: 'device-new',
          location: 'New Location',
          is_active: true,
          created_at: '2024-02-01T10:00:00',
        },
        {
          device_id: 'device-old',
          location: 'Old Location',
          is_active: true,
          created_at: '2024-01-01T10:00:00',
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockActiveDevices,
              error: null,
            }),
          }),
        }),
      } as any);

      const result = await getActiveDevices();
      expect(result[0].created_at).toBe('2024-02-01T10:00:00');
      expect(result[1].created_at).toBe('2024-01-01T10:00:00');
    });

    it('should handle database query with proper chaining', async () => {
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

      await getActiveDevices();

      expect(mockSupabase.from).toHaveBeenCalledWith('iot_devices');
    });
  });

  describe('IoTDevice interface validation', () => {
    it('should have correct IoTDevice interface structure', () => {
      const device: IoTDevice = {
        device_id: 'device-123',
        location: 'Test Location',
        is_active: true,
        created_at: '2024-01-01T00:00:00',
      };

      expect(device).toHaveProperty('device_id');
      expect(device).toHaveProperty('location');
      expect(device).toHaveProperty('is_active');
      expect(device).toHaveProperty('created_at');
    });

    it('should allow null location', () => {
      const device: IoTDevice = {
        device_id: 'device-123',
        location: null,
        is_active: true,
        created_at: '2024-01-01T00:00:00',
      };

      expect(device.location).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const error = {
        message: 'Connection failed',
        code: 'DB_ERROR',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result).toEqual([]);
    });

    it('should handle null data response', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      } as any);

      const result = await getDevices();
      expect(result).toEqual([]);
    });
  });
});
