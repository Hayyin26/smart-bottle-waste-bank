export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // UUID from auth.users
          full_name: string | null;
          role: 'admin' | 'user';
          total_points: number;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: 'admin' | 'user';
          total_points?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      iot_devices: {
        Row: {
          device_id: string;
          location: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          device_id: string;
          location?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['iot_devices']['Insert']>;
      };
      transactions: {
        Row: {
          id: number;
          user_id: string | null;
          device_id: string | null;
          points_earned: number;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          device_id?: string | null;
          points_earned?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
    };
  };
};
