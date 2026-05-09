# 🏦 IoT Bank Sampah Digital

Sistem IoT untuk Bank Sampah Digital menggunakan ESP32, Supabase, dan Next.js.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 Deskripsi

**IoT Bank Sampah Digital** adalah sistem otomatis untuk mengelola bank sampah menggunakan teknologi IoT. Sistem ini menggunakan ESP32 untuk mendeteksi dan memvalidasi botol plastik, memberikan poin kepada user, dan menampilkan data real-time di dashboard web.

### ✨ Fitur Utama

- 🤖 **Deteksi Otomatis**: Sensor ultrasonik mendeteksi ukuran botol
- ✅ **Validasi Ukuran**: Hanya botol dengan ukuran valid yang diterima
- 🎯 **Sistem Poin**: User mendapat 10 poin per botol
- 📱 **QR Code Login**: User scan QR untuk login/register
- 📊 **Dashboard Real-time**: Monitor transaksi dan statistik
- 🏆 **Leaderboard**: Ranking user berdasarkan poin
- 🔔 **Notifikasi**: LCD display dan buzzer untuk feedback
- 🔐 **Multi-user**: Support banyak user dengan akun terpisah

---

## 🛠️ Teknologi

### Hardware
- **ESP32** - Microcontroller
- **HC-SR04** - Sensor Ultrasonik (2x)
- **SG90** - Servo Motor
- **LCD 16x2 I2C** - Display
- **Buzzer** - Audio feedback
- **IR Lamp** - Lighting

### Software
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + REST API + Real-time)
- **Hardware**: Arduino C++ (ESP32)
- **Authentication**: Supabase Auth + QR Code

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/username/iot-bank-sampah.git
cd iot-bank-sampah
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Database
```sql
-- Run these SQL files in Supabase SQL Editor:
1. create-iot-sessions-table.sql
2. fix-auto-update-points.sql
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Upload ESP32 Code
1. Open `iot-improved.ino` in Arduino IDE
2. Update WiFi credentials
3. Choose mode (`USE_QR_LOGIN = true/false`)
4. Upload to ESP32

---

## 📁 Struktur Proyek

```
iot-bank-sampah/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── dashboard/          # Dashboard utama
│   │   ├── qr-login/           # Generate QR code
│   │   ├── iot-auth/           # Login/register page
│   │   ├── nasabah/            # User management
│   │   ├── transaksi/          # Transaction history
│   │   ├── laporan/            # Reports
│   │   └── api/                # API routes
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   │   └── supabase.ts         # Supabase client
│   └── services/               # Service layer
│       ├── transactions.service.ts
│       ├── profiles.service.ts
│       └── iot-devices.service.ts
├── iot-improved.ino            # ESP32 code
├── .env                        # Environment variables
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 📚 Dokumentasi

### Panduan Lengkap
- 📊 **[PROJECT_STATUS_SUMMARY.md](PROJECT_STATUS_SUMMARY.md)** - Status proyek dan fitur
- 🚀 **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Panduan cepat operasional
- 🏗️ **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** - Diagram arsitektur sistem
- 🌐 **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Panduan deployment production
- 🔄 **[SYSTEM_FLOW_EXPLANATION.md](SYSTEM_FLOW_EXPLANATION.md)** - Penjelasan alur sistem

### Panduan Spesifik
- 🔐 **[QR_LOGIN_SYSTEM_GUIDE.md](QR_LOGIN_SYSTEM_GUIDE.md)** - Sistem QR login
- ☁️ **[AWS_INTEGRATION_GUIDE.md](AWS_INTEGRATION_GUIDE.md)** - Integrasi AWS (opsional)
- 🔧 **[FIX_POINTS_NOT_UPDATING.md](FIX_POINTS_NOT_UPDATING.md)** - Fix auto-update points
- 🗑️ **[CLEAN_DEVICES_GUIDE.md](CLEAN_DEVICES_GUIDE.md)** - Manage devices

### SQL Scripts
- `create-iot-sessions-table.sql` - Create table untuk QR sessions
- `fix-auto-update-points.sql` - Trigger auto-update points
- `fix-delete-devices-with-transactions.sql` - Delete devices safely

---

## 🎯 Cara Penggunaan

### Mode 1: Simple (Default User)
Cocok untuk testing atau single-user.

```cpp
// Di iot-improved.ino:
#define USE_QR_LOGIN false
```

1. Upload code ke ESP32
2. Masukkan botol
3. Points otomatis masuk ke default user
4. Cek dashboard untuk melihat data

### Mode 2: QR Login (Multi-User)
Cocok untuk production dengan banyak user.

```cpp
// Di iot-improved.ino:
#define USE_QR_LOGIN true
```

1. Buka `/qr-login` di browser
2. Generate QR code
3. Print dan tempel di device
4. User scan QR dengan smartphone
5. User login atau register
6. User masukkan botol
7. Points masuk ke akun user
8. Cek dashboard untuk melihat data

---

## 🔧 Konfigurasi

### ESP32 Configuration
```cpp
// WiFi
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase
const char* supabase_url = "https://your-project.supabase.co";
const char* supabase_key = "your_anon_key";

// Device
const char* device_id = "ESP32-BOTOL-01";

// Mode
#define USE_QR_LOGIN false  // true for QR login, false for simple mode

// Default User (for simple mode)
const char* default_user_id = "your_user_id";

// API Endpoint (for QR login mode)
const char* api_get_user = "http://192.168.1.100:3000/api/iot/get-user";
```

### Sensor Configuration
```cpp
// Bottle size validation (cm)
#define HEIGHT_MIN_CM 8
#define HEIGHT_MAX_CM 25
#define LENGTH_MIN_CM 3
#define LENGTH_MAX_CM 12

// Detection thresholds (cm)
#define OBJECT_PRESENT_CM 35
#define OBJECT_GONE_CM 45
```

---

## 📊 Database Schema

### Table: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  full_name TEXT,
  role TEXT,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: iot_devices
```sql
CREATE TABLE iot_devices (
  device_id TEXT PRIMARY KEY,
  location TEXT,
  status TEXT,
  last_active TIMESTAMP
);
```

### Table: transactions
```sql
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  device_id TEXT REFERENCES iot_devices(device_id),
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: iot_sessions
```sql
CREATE TABLE iot_sessions (
  session_token TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  device_id TEXT,
  expires_at TIMESTAMP
);
```

---

## 🧪 Testing

### Test Frontend
```bash
npm run dev
# Open http://localhost:3000
```

### Test ESP32
```bash
# Open Serial Monitor (115200 baud)
# Check for:
# ✅ WiFi Connected!
# ✅ IP Address: 192.168.x.x
# ✅ SYSTEM READY
```

### Test Transaction
1. Masukkan botol ke device
2. Cek Serial Monitor untuk log
3. Cek dashboard untuk transaksi baru
4. Verify points bertambah

---

## 🐛 Troubleshooting

### Problem: ESP32 tidak connect WiFi
```cpp
// Cek SSID dan password
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### Problem: Points tidak update
```sql
-- Install trigger:
-- Run fix-auto-update-points.sql
```

### Problem: Error 409 foreign key
```sql
-- Pastikan user_id ada di profiles:
SELECT id FROM profiles WHERE id = 'your_user_id';
```

### Problem: QR login tidak berfungsi
1. Cek IP di `api_get_user` sudah benar
2. Cek web server running
3. Cek smartphone dan komputer di WiFi yang sama

Lihat [QUICK_REFERENCE.md](QUICK_REFERENCE.md) untuk troubleshooting lengkap.

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel Dashboard
# Or use CLI:
vercel --prod
```

### Deploy ESP32
1. Update WiFi credentials
2. Update API endpoint (production URL)
3. Upload to ESP32
4. Mount di lokasi fisik

Lihat [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) untuk panduan lengkap.

---

## 📈 Roadmap

### Version 1.0 (Current) ✅
- [x] Basic IoT detection
- [x] Database integration
- [x] QR login system
- [x] Real-time dashboard
- [x] Leaderboard
- [x] Multi-user support

### Version 1.1 (Planned)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Reward system
- [ ] Admin panel

### Version 2.0 (Future)
- [ ] Multiple device types (plastic, paper, metal)
- [ ] Weight-based points
- [ ] Blockchain integration
- [ ] AI-powered classification
- [ ] Marketplace for rewards

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Your Name
- **Hardware**: Your Name
- **Design**: Your Name

---

## 📞 Support

Jika ada pertanyaan atau masalah:

- 📧 Email: your.email@example.com
- 💬 Discord: [Join our server](https://discord.gg/yourserver)
- 🐛 Issues: [GitHub Issues](https://github.com/username/iot-bank-sampah/issues)

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Next.js](https://nextjs.org) - React Framework
- [Vercel](https://vercel.com) - Hosting Platform
- [Arduino](https://arduino.cc) - ESP32 Development
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### QR Login
![QR Login](docs/screenshots/qr-login.png)

### ESP32 Device
![ESP32 Device](docs/screenshots/device.png)

---

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [ESP32 Documentation](https://docs.espressif.com)
- [Arduino Reference](https://www.arduino.cc/reference/en/)

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=username/iot-bank-sampah&type=Date)](https://star-history.com/#username/iot-bank-sampah&Date)

---

**Made with ❤️ by Your Team**

**Last Updated:** 6 Mei 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅

---

## 🎯 Quick Links

- [📊 Project Status](PROJECT_STATUS_SUMMARY.md)
- [🚀 Quick Reference](QUICK_REFERENCE.md)
- [🏗️ Architecture](ARCHITECTURE_DIAGRAM.md)
- [🌐 Deployment Guide](DEPLOYMENT_GUIDE.md)
- [🔄 System Flow](SYSTEM_FLOW_EXPLANATION.md)
- [🔐 QR Login Guide](QR_LOGIN_SYSTEM_GUIDE.md)

---

**Happy Coding! 🚀**
