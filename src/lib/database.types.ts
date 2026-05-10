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
          bottle_weight: number | null; // Berat botol dalam gram
          bottle_type: string | null; // Kategori botol: KECIL, SEDANG, BESAR
          bottle_category_id: number | null; // Foreign key ke bottle_categories
        };
        Insert: {
          user_id?: string | null;
          device_id?: string | null;
          points_earned?: number;
          created_at?: string;
          bottle_weight?: number | null;
          bottle_type?: string | null;
          bottle_category_id?: number | null;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      bottle_categories: {
        Row: {
          id: number;
          category_key: string;
          category_name: string;
          min_weight: number;
          max_weight: number;
          points_earned: number;
          color_hex: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category_key: string;
          category_name: string;
          min_weight: number;
          max_weight: number;
          points_earned: number;
          color_hex?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bottle_categories']['Insert']>;
      };
    };
  };
};
