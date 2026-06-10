# IoT QR Code Integration Guide

## Overview

Sistem ini mengintegrasikan aplikasi web dengan IoT devices untuk scan QR code. Setiap kali user scan QR code di device IoT, transaksi akan tercatat dan points akan otomatis ditambahkan ke akun user.

## Database Schema

### Tables

#### 1. profiles
User profiles dengan points system
```sql
- id (UUID) - Primary key, linked to auth.users
- full_name (TEXT) - Nama lengkap user
- role (TEXT) - 'admin' atau 'user'
- total_points (INTEGER) - Total points yang dimiliki
- updated_at (TIMESTAMP) - Last update time
```

#### 2. iot_devices
IoT devices yang terdaftar
```sql
- device_id (TEXT) - Primary key, unique device identifier
- location (TEXT) - Lokasi device
- is_active (BOOLEAN) - Status aktif/nonaktif
- created_at (TIMESTAMP) - Waktu registrasi device
```

#### 3. transactions
Transaksi scan QR code
```sql
- id (BIGINT) - Primary key, auto-increment
- user_id (UUID) - Foreign key ke profiles
- device_id (TEXT) - Foreign key ke iot_devices
- points_earned (INTEGER) - Points yang didapat (default: 10)
- created_at (TIMESTAMP) - Waktu transaksi
```

## Setup Database

### 1. Jalankan SQL Functions

Buka Supabase SQL Editor dan jalankan file `supabase-functions.sql`:

```sql
-- Function untuk increment points
CREATE OR REPLACE FUNCTION increment_user_points(user_uuid UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = total_points + points_to_add,
    updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Enable Row Level Security (RLS)

Jika belum ada, tambahkan RLS policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Public read access (sesuaikan dengan kebutuhan keamanan Anda)
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON iot_devices FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON transactions FOR SELECT USING (true);

-- Insert policies (untuk IoT device)
CREATE POLICY "Enable insert for authenticated users" ON transactions 
  FOR INSERT WITH CHECK (true);
```

## API Services

### Profiles Service (`src/services/profiles.service.ts`)

```typescript
import { getProfiles, getProfileById, getTopUsers, getTotalUsers } from '@/services/profiles.service';

// Get all profiles
const profiles = await getProfiles();

// Get top users by points
const topUsers = await getTopUsers(10);

// Get total user count
const totalUsers = await getTotalUsers();
```

### Transactions Service (`src/services/transactions.service.ts`)

```typescript
import { 
  getTransactions, 
  getRecentTransactions,
  createTransaction,
  getTotalTransactions,
  getTotalPointsDistributed 
} from '@/services/transactions.service';

// Get all transactions
const transactions = await getTransactions();

// Get recent transactions
const recent = await getRecentTransactions(10);

// Create new transaction (dari IoT device)
const newTransaction = await createTransaction({
  user_id: 'user-uuid',
  device_id: 'device-001',
  points_earned: 10
});

// Get statistics
const totalTransactions = await getTotalTransactions();
const totalPoints = await getTotalPointsDistributed();
```

### IoT Devices Service (`src/services/iot-devices.service.ts`)

```typescript
import { 
  getDevices, 
  getActiveDevices,
  createDevice,
  updateDevice 
} from '@/services/iot-devices.service';

// Get all devices
const devices = await getDevices();

// Get only active devices
const activeDevices = await getActiveDevices();

// Register new device
const newDevice = await createDevice({
  device_id: 'device-001',
  location: 'Gedung A Lantai 1',
  is_active: true
});

// Update device status
await updateDevice('device-001', { is_active: false });
```

## Real-time Updates

Aplikasi menggunakan Supabase Realtime untuk update otomatis saat ada transaksi baru.

### Contoh Implementation

```typescript
import { supabase } from '@/lib/supabase';

useEffect(() => {
  // Subscribe to transaction changes
  const channel = supabase
    .channel('transactions-changes')
    .on(
      'postgres_changes',
      {
        event: '*', // INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'transactions',
      },
      (payload) => {
        console.log('New transaction:', payload);
        // Refresh data
        fetchTransactions();
      }
    )
    .subscribe();

  return () => {
    channel.unsubscribe();
  };
}, []);
```

## IoT Device Integration

### Flow Transaksi QR Code

1. **User scan QR code** di IoT device
2. **IoT device kirim request** ke Supabase:
   ```javascript
   // Dari IoT device (ESP32/Arduino/Raspberry Pi)
   POST https://dsdtxqpzofrvzxpyktoo.supabase.co/rest/v1/transactions
   Headers:
     apikey: YOUR_SUPABASE_ANON_KEY
     Authorization: Bearer YOUR_SUPABASE_ANON_KEY
     Content-Type: application/json
   
   Body:
   {
     "user_id": "uuid-from-qr-code",
     "device_id": "device-001",
     "points_earned": 10
   }
   ```

3. **Supabase trigger** function `increment_user_points`
4. **Web app** menerima real-time update
5. **Dashboard** otomatis refresh menampilkan transaksi baru

### Contoh Code untuk IoT Device (ESP32)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* supabaseUrl = "https://dsdtxqpzofrvzxpyktoo.supabase.co";
const char* supabaseKey = "YOUR_SUPABASE_ANON_KEY";

void sendTransaction(String userId, String deviceId) {
  HTTPClient http;
  
  String url = String(supabaseUrl) + "/rest/v1/transactions";
  http.begin(url);
  
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", "Bearer " + String(supabaseKey));
  http.addHeader("Content-Type", "application/json");
  
  StaticJsonDocument<200> doc;
  doc["user_id"] = userId;
  doc["device_id"] = deviceId;
  doc["points_earned"] = 10;
  
  String jsonBody;
  serializeJson(doc, jsonBody);
  
  int httpCode = http.POST(jsonBody);
  
  if (httpCode == 201) {
    Serial.println("Transaction created successfully!");
  } else {
    Serial.printf("Error: %d\n", httpCode);
  }
  
  http.end();
}
```

### Contoh Code untuk IoT Device (Python/Raspberry Pi)

```python
import requests
import json

SUPABASE_URL = "https://dsdtxqpzofrvzxpyktoo.supabase.co"
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"

def send_transaction(user_id, device_id, points=10):
    url = f"{SUPABASE_URL}/rest/v1/transactions"
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "user_id": user_id,
        "device_id": device_id,
        "points_earned": points
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        print("Transaction created successfully!")
        return True
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return False

# Usage
user_id = "uuid-from-qr-code"
device_id = "device-001"
send_transaction(user_id, device_id)
```

## QR Code Format

QR code harus berisi user UUID dalam format:

```
user://uuid-here
```

Atau JSON format:

```json
{
  "user_id": "uuid-here",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Components

### 1. TransactionList
Menampilkan list transaksi dengan real-time updates

```tsx
import TransactionList from '@/components/iot/transaction-list';

<TransactionList limit={10} />
```

### 2. DeviceStatus
Menampilkan status semua IoT devices

```tsx
import DeviceStatus from '@/components/iot/device-status';

<DeviceStatus />
```

### 3. Leaderboard
Menampilkan top users berdasarkan points

```tsx
import Leaderboard from '@/components/iot/leaderboard';

<Leaderboard limit={10} />
```

## Testing

### 1. Register Device

```sql
INSERT INTO iot_devices (device_id, location, is_active) VALUES
  ('device-001', 'Gedung A Lantai 1', true),
  ('device-002', 'Gedung B Lantai 2', true);
```

### 2. Create Test User

```sql
-- Assuming you have auth.users with id
INSERT INTO profiles (id, full_name, role, total_points) VALUES
  ('user-uuid-here', 'Test User', 'user', 0);
```

### 3. Simulate Transaction

```sql
INSERT INTO transactions (user_id, device_id, points_earned) VALUES
  ('user-uuid-here', 'device-001', 10);
```

### 4. Verify Points Updated

```sql
SELECT * FROM profiles WHERE id = 'user-uuid-here';
-- total_points should be 10
```

## Security Considerations

1. **API Keys**: Jangan expose Supabase service role key di IoT device
2. **RLS Policies**: Sesuaikan RLS policies dengan kebutuhan keamanan
3. **Rate Limiting**: Implementasi rate limiting untuk prevent abuse
4. **Device Authentication**: Tambahkan authentication untuk IoT devices
5. **QR Code Expiry**: Implementasi expiry time untuk QR codes

## Troubleshooting

### Transaction tidak tercatat
- Cek apakah device_id ada di tabel iot_devices
- Cek apakah user_id valid
- Cek console log untuk error messages

### Points tidak terupdate
- Pastikan function `increment_user_points` sudah dibuat
- Cek apakah ada error di Supabase logs

### Real-time tidak bekerja
- Pastikan Realtime enabled di Supabase project settings
- Cek browser console untuk connection errors

## Next Steps

1. ✅ Setup database schema
2. ✅ Create API services
3. ✅ Build UI components
4. 🔄 Test dengan IoT device
5. 📱 Generate QR codes untuk users
6. 🔐 Implement authentication
7. 🚀 Deploy to production
