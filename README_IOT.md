# IoT QR Code System - Bank Sampah

Sistem manajemen bank sampah dengan integrasi IoT untuk scan QR code dan points reward system.

## 🎯 Features

### ✅ Real-time Dashboard
- Live transaction updates menggunakan Supabase Realtime
- Statistics: Total users, scans, points distributed
- IoT device status monitoring
- User leaderboard

### ✅ IoT Integration
- Support untuk multiple IoT devices (ESP32, Arduino, Raspberry Pi)
- QR code scanning system
- Automatic points distribution
- Device activity tracking

### ✅ Points System
- Otomatis tambah points saat scan QR
- User leaderboard berdasarkan points
- Transaction history dengan real-time updates

### ✅ User Management
- User profiles dengan role (admin/user)
- Total points tracking
- Transaction history per user

## 🗄️ Database Schema

### Tables
1. **profiles** - User profiles dengan points
2. **iot_devices** - IoT devices yang terdaftar
3. **transactions** - Transaksi scan QR code

Lihat detail di `IOT_INTEGRATION.md`

## 🚀 Quick Start

### 1. Setup Database Functions
```bash
# Jalankan di Supabase SQL Editor
supabase-functions.sql
```

### 2. Insert Sample Data
```sql
-- Device
INSERT INTO iot_devices (device_id, location, is_active) VALUES
  ('device-001', 'Gedung A Lantai 1', true);

-- Profile (ganti dengan UUID dari auth.users)
INSERT INTO profiles (id, full_name, role, total_points) VALUES
  ('your-uuid', 'Test User', 'user', 0);

-- Transaction
INSERT INTO transactions (user_id, device_id, points_earned) VALUES
  ('your-uuid', 'device-001', 10);
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Dashboard
```
http://localhost:3000/dashboard
```

## 📱 IoT Device Integration

### ESP32 Example
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

void sendTransaction(String userId, String deviceId) {
  HTTPClient http;
  http.begin("https://your-project.supabase.co/rest/v1/transactions");
  http.addHeader("apikey", "YOUR_KEY");
  http.addHeader("Content-Type", "application/json");
  
  String json = "{\"user_id\":\"" + userId + "\",\"device_id\":\"" + deviceId + "\",\"points_earned\":10}";
  http.POST(json);
  http.end();
}
```

### Python/Raspberry Pi Example
```python
import requests

def send_transaction(user_id, device_id):
    url = "https://your-project.supabase.co/rest/v1/transactions"
    headers = {
        "apikey": "YOUR_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "user_id": user_id,
        "device_id": device_id,
        "points_earned": 10
    }
    requests.post(url, headers=headers, json=data)
```

## 📊 Components

### Transaction List
```tsx
import TransactionList from '@/components/iot/transaction-list';
<TransactionList limit={10} />
```

### Device Status
```tsx
import DeviceStatus from '@/components/iot/device-status';
<DeviceStatus />
```

### Leaderboard
```tsx
import Leaderboard from '@/components/iot/leaderboard';
<Leaderboard limit={10} />
```

## 🔧 API Services

### Transactions
```typescript
import { 
  getTransactions, 
  createTransaction,
  getTotalTransactions 
} from '@/services/transactions.service';

// Get all transactions
const transactions = await getTransactions();

// Create new transaction
await createTransaction({
  user_id: 'uuid',
  device_id: 'device-001',
  points_earned: 10
});
```

### Profiles
```typescript
import { 
  getProfiles, 
  getTopUsers 
} from '@/services/profiles.service';

// Get top users
const topUsers = await getTopUsers(10);
```

### IoT Devices
```typescript
import { 
  getDevices, 
  getActiveDevices 
} from '@/services/iot-devices.service';

// Get all devices
const devices = await getDevices();
```

## 📁 Project Structure

```
src/
├── app/
│   ├── dashboard/          # Main dashboard dengan real-time updates
│   ├── history/            # Transaction history
│   ├── nasabah/            # User management (legacy)
│   └── transaksi/          # Transaction management (legacy)
├── components/
│   ├── iot/                # IoT-specific components
│   │   ├── transaction-list.tsx
│   │   ├── device-status.tsx
│   │   └── leaderboard.tsx
│   └── waste-bank/         # Legacy components
├── services/               # API service functions
│   ├── transactions.service.ts
│   ├── profiles.service.ts
│   └── iot-devices.service.ts
└── lib/
    ├── supabase.ts         # Supabase client
    └── database.types.ts   # TypeScript types
```

## 📚 Documentation

- `QUICK_START.md` - Setup cepat 5 menit
- `IOT_INTEGRATION.md` - Panduan lengkap integrasi IoT
- `supabase-functions.sql` - SQL functions untuk points system

## 🔐 Security

1. **RLS Policies**: Row Level Security enabled
2. **API Keys**: Gunakan anon key untuk IoT devices
3. **Rate Limiting**: Implementasi di level Supabase
4. **QR Code**: Generate unique UUID per user

## 🎯 Next Steps

1. ✅ Database setup
2. ✅ Real-time dashboard
3. ✅ IoT integration ready
4. 🔄 Generate QR codes untuk users
5. 🔄 Setup IoT device fisik
6. 🔄 Test end-to-end flow
7. 🔄 Deploy to production

## 🐛 Troubleshooting

### Transaction tidak tercatat
- Cek device_id ada di tabel iot_devices
- Cek user_id valid
- Lihat Supabase logs untuk error

### Real-time tidak bekerja
- Enable Realtime di Supabase settings
- Cek browser console untuk errors
- Verify WebSocket connection

### Points tidak update
- Pastikan function `increment_user_points` sudah dibuat
- Cek Supabase logs

## 📞 Support

Baca dokumentasi lengkap di `IOT_INTEGRATION.md` untuk detail lebih lanjut.

## 📄 License

MIT License
