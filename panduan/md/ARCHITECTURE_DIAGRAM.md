# 🏗️ Architecture Diagram - IoT Bank Sampah Digital

Diagram arsitektur lengkap sistem IoT Bank Sampah Digital.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IoT BANK SAMPAH DIGITAL                      │
│                         Complete System Architecture                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   HARDWARE       │         │   BACKEND        │         │   FRONTEND       │
│   (ESP32)        │◄───────►│   (Supabase)     │◄───────►│   (Next.js)      │
└──────────────────┘         └──────────────────┘         └──────────────────┘
        │                            │                            │
        │                            │                            │
        ▼                            ▼                            ▼
   Sensors &                    Database &                   Web Dashboard
   Actuators                    REST API                     & QR System
```

---

## 🔌 Hardware Layer (ESP32)

```
┌─────────────────────────────────────────────────────────────────┐
│                         ESP32 DEVICE                             │
│                      (ESP32-BOTOL-01)                            │
└─────────────────────────────────────────────────────────────────┘

INPUT SENSORS:                    OUTPUT ACTUATORS:
┌──────────────────┐              ┌──────────────────┐
│ Ultrasonic #1    │              │ Servo Motor      │
│ (Height)         │              │ (Gate Control)   │
│ Pin: 4, 18       │              │ Pin: 19          │
└──────────────────┘              └──────────────────┘
                                  
┌──────────────────┐              ┌──────────────────┐
│ Ultrasonic #2    │              │ LCD I2C 16x2     │
│ (Length)         │              │ (Display)        │
│ Pin: 5, 15       │              │ I2C: 21, 22      │
└──────────────────┘              └──────────────────┘

                                  ┌──────────────────┐
                                  │ Buzzer           │
                                  │ (Sound Alert)    │
                                  │ Pin: 23          │
                                  └──────────────────┘

                                  ┌──────────────────┐
                                  │ IR Lamp          │
                                  │ (Lighting)       │
                                  │ Pin: 13          │
                                  └──────────────────┘

CONNECTIVITY:
┌──────────────────┐
│ WiFi Module      │
│ SSID: Kost       │
│ Premium          │
└──────────────────┘
```

---

## 🗄️ Database Layer (Supabase PostgreSQL)

```
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE DATABASE                           │
│                   (PostgreSQL + REST API)                        │
└─────────────────────────────────────────────────────────────────┘

TABLE: profiles                    TABLE: iot_devices
┌──────────────────┐              ┌──────────────────┐
│ id (uuid) PK     │              │ device_id (text) │
│ full_name        │              │ location         │
│ role             │              │ status           │
│ total_points     │              │ last_active      │
│ created_at       │              └──────────────────┘
└──────────────────┘                       │
        │                                  │
        │                                  │
        └────────┬─────────────────────────┘
                 │
                 ▼
        TABLE: transactions
        ┌──────────────────┐
        │ id (bigint) PK   │
        │ user_id (FK)     │───► profiles.id
        │ device_id (FK)   │───► iot_devices.device_id
        │ points_earned    │
        │ created_at       │
        └──────────────────┘
                 │
                 │ TRIGGER: auto_update_points
                 │
                 ▼
        UPDATE profiles.total_points


TABLE: iot_sessions (QR Login)
┌──────────────────┐
│ session_token PK │
│ user_id (FK)     │───► profiles.id
│ device_id        │
│ expires_at       │
└──────────────────┘
```

---

## 🌐 Frontend Layer (Next.js)

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS WEB APPLICATION                     │
│                    (React 19 + TypeScript)                       │
└─────────────────────────────────────────────────────────────────┘

PAGES:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   /dashboard     │  │   /qr-login      │  │   /iot-auth      │
│                  │  │                  │  │                  │
│ • Statistics     │  │ • Generate QR    │  │ • Login Form     │
│ • Transactions   │  │ • Print QR       │  │ • Register Form  │
│ • Leaderboard    │  │ • Download QR    │  │ • Session Save   │
│ • Device Status  │  │                  │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   /nasabah       │  │   /transaksi     │  │   /laporan       │
│                  │  │                  │  │                  │
│ • User List      │  │ • Transaction    │  │ • Reports        │
│ • User Details   │  │   History        │  │ • Analytics      │
│ • Add/Edit User  │  │ • Filter/Search  │  │ • Export Data    │
└──────────────────┘  └──────────────────┘  └──────────────────┘

API ROUTES:
┌──────────────────────────────────────┐
│   /api/iot/get-user                  │
│                                      │
│ • GET: Retrieve user from session    │
│ • DELETE: Clear session              │
│ • Used by ESP32 for QR login         │
└──────────────────────────────────────┘

SERVICES:
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ transactions     │  │ profiles         │  │ iot-devices      │
│ .service.ts      │  │ .service.ts      │  │ .service.ts      │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 🔄 Data Flow Diagrams

### Flow 1: Simple Mode (Default User)

```
┌─────────┐
│  USER   │
│ Inserts │
│ Bottle  │
└────┬────┘
     │
     ▼
┌─────────────────────────────────────┐
│         ESP32 DEVICE                │
│                                     │
│  1. Sensor detects bottle           │
│  2. Validate size (8-25cm x 3-12cm) │
│  3. Open gate if valid              │
│  4. Wait for bottle to pass         │
│  5. Close gate                      │
└────┬────────────────────────────────┘
     │
     │ HTTP POST
     │ /rest/v1/transactions
     │
     ▼
┌─────────────────────────────────────┐
│      SUPABASE DATABASE              │
│                                     │
│  1. INSERT transaction              │
│     - user_id: default_user_id      │
│     - device_id: ESP32-BOTOL-01     │
│     - points_earned: 10             │
│                                     │
│  2. TRIGGER auto_update_points      │
│     - UPDATE profiles               │
│     - SET total_points += 10        │
└────┬────────────────────────────────┘
     │
     │ Real-time Subscription
     │
     ▼
┌─────────────────────────────────────┐
│       WEB DASHBOARD                 │
│                                     │
│  1. Auto-refresh (30s)              │
│  2. Show new transaction            │
│  3. Update total points             │
│  4. Update leaderboard              │
└─────────────────────────────────────┘
```

### Flow 2: QR Login Mode (Multi-User)

```
STEP 1: GENERATE QR CODE
┌─────────┐
│  ADMIN  │
│  Opens  │
│/qr-login│
└────┬────┘
     │
     ▼
┌─────────────────────────────────────┐
│      WEB: /qr-login                 │
│                                     │
│  1. Generate session_token          │
│  2. Create QR with URL:             │
│     /iot-auth?device=ESP32&token=X  │
│  3. Print/Display QR                │
└─────────────────────────────────────┘


STEP 2: USER SCAN & LOGIN
┌─────────┐
│  USER   │
│  Scans  │
│   QR    │
└────┬────┘
     │
     ▼
┌─────────────────────────────────────┐
│      WEB: /iot-auth                 │
│                                     │
│  1. User login/register             │
│  2. Get user_id from auth           │
│  3. Save to iot_sessions:           │
│     - session_token                 │
│     - user_id                       │
│     - device_id                     │
│     - expires_at (5 min)            │
└────┬────────────────────────────────┘
     │
     │ Session saved
     │
     ▼
┌─────────────────────────────────────┐
│         ESP32 DEVICE                │
│                                     │
│  1. Periodic check session          │
│     GET /api/iot/get-user?token=X   │
│  2. Retrieve user_id                │
│  3. Display user name on LCD        │
│  4. Ready for transaction           │
└────┬────────────────────────────────┘
     │
     │ User inserts bottle
     │
     ▼
┌─────────────────────────────────────┐
│         ESP32 DEVICE                │
│                                     │
│  1. Validate bottle size            │
│  2. Open gate if valid              │
│  3. POST transaction with user_id   │
└────┬────────────────────────────────┘
     │
     │ HTTP POST
     │ /rest/v1/transactions
     │
     ▼
┌─────────────────────────────────────┐
│      SUPABASE DATABASE              │
│                                     │
│  1. INSERT transaction              │
│     - user_id: from session         │
│     - device_id: ESP32-BOTOL-01     │
│     - points_earned: 10             │
│                                     │
│  2. TRIGGER auto_update_points      │
│     - UPDATE profiles               │
│     - SET total_points += 10        │
│       WHERE id = user_id            │
└────┬────────────────────────────────┘
     │
     │ Real-time Subscription
     │
     ▼
┌─────────────────────────────────────┐
│       WEB DASHBOARD                 │
│                                     │
│  1. Show transaction for user       │
│  2. Update user's total points      │
│  3. Update leaderboard              │
└─────────────────────────────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: NETWORK SECURITY
┌──────────────────┐
│ WiFi WPA2        │
│ Encryption       │
└──────────────────┘

LAYER 2: API AUTHENTICATION
┌──────────────────┐
│ Supabase API Key │
│ (Anon Key)       │
│ JWT Token        │
└──────────────────┘

LAYER 3: DATABASE SECURITY
┌──────────────────┐
│ Row Level        │
│ Security (RLS)   │
│ Policies         │
└──────────────────┘

LAYER 4: SESSION MANAGEMENT
┌──────────────────┐
│ Session Token    │
│ 5 min Expiry     │
│ Auto-cleanup     │
└──────────────────┘

LAYER 5: INPUT VALIDATION
┌──────────────────┐
│ Size Validation  │
│ Type Checking    │
│ SQL Injection    │
│ Prevention       │
└──────────────────┘
```

---

## 📊 State Machine (ESP32)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESP32 STATE MACHINE                           │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  WAIT_USER   │ (QR Login Mode Only)
                    │              │
                    │ LCD: "SCAN   │
                    │       QR"    │
                    └──────┬───────┘
                           │
                           │ Session found
                           │
                           ▼
                    ┌──────────────┐
         ┌─────────►│ WAIT_BOTTLE  │◄─────────┐
         │          │              │          │
         │          │ LCD: "SIAP   │          │
         │          │  MASUKKAN"   │          │
         │          └──────┬───────┘          │
         │                 │                  │
         │                 │ Bottle detected  │
         │                 │                  │
         │                 ▼                  │
         │          ┌──────────────┐          │
         │          │   VALIDATE   │          │
         │          │     SIZE     │          │
         │          └──────┬───────┘          │
         │                 │                  │
         │        ┌────────┴────────┐         │
         │        │                 │         │
         │    VALID              INVALID      │
         │        │                 │         │
         │        ▼                 ▼         │
         │ ┌──────────────┐  ┌──────────────┐│
         │ │  WAIT_PASS   │  │ REJECT_HOLD  ││
         │ │              │  │              ││
         │ │ Gate: OPEN   │  │ Gate: CLOSED ││
         │ │ LCD: "VALID" │  │ LCD: "SALAH" ││
         │ │ Buzzer: 1x   │  │ Buzzer: 2x   ││
         │ └──────┬───────┘  └──────┬───────┘│
         │        │                 │         │
         │        │ Bottle passed   │ 1.5s    │
         │        │                 │         │
         │        ▼                 │         │
         │ ┌──────────────┐         │         │
         │ │ SEND TO DB   │         │         │
         │ │              │         │         │
         │ │ POST /trans  │         │         │
         │ │ +10 points   │         │         │
         │ └──────┬───────┘         │         │
         │        │                 │         │
         └────────┴─────────────────┘         │
                  │                           │
                  │ Success                   │
                  │                           │
                  └───────────────────────────┘
```

---

## 🌍 Network Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK TOPOLOGY                            │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   INTERNET   │
                    └──────┬───────┘
                           │
                           │
                    ┌──────▼───────┐
                    │   SUPABASE   │
                    │   CLOUD      │
                    │              │
                    │ • Database   │
                    │ • REST API   │
                    │ • Auth       │
                    └──────┬───────┘
                           │
                           │ HTTPS
                           │
                    ┌──────▼───────┐
                    │  WiFi Router │
                    │ "Kost        │
                    │  Premium"    │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
         ┌──────▼───────┐      ┌─────▼──────┐
         │   ESP32      │      │  Computer  │
         │   Device     │      │  (Dev)     │
         │              │      │            │
         │ IP: 192.168  │      │ IP: 192.168│
         │     .1.50    │      │     .1.100 │
         └──────────────┘      └─────┬──────┘
                                     │
                              ┌──────▼───────┐
                              │  Next.js     │
                              │  Server      │
                              │  :3000       │
                              └──────┬───────┘
                                     │
                              ┌──────▼───────┐
                              │  Smartphone  │
                              │  (User)      │
                              │              │
                              │ Scan QR      │
                              │ Login/Reg    │
                              └──────────────┘
```

---

## 📦 Component Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                   COMPONENT DEPENDENCIES                         │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (Next.js)
├── React 19
├── TypeScript
├── Tailwind CSS
├── @supabase/supabase-js
├── qrcode
├── lucide-react (icons)
├── date-fns
└── next-themes

BACKEND (Supabase)
├── PostgreSQL 15
├── PostgREST (REST API)
├── GoTrue (Auth)
├── Realtime (WebSocket)
└── Storage

HARDWARE (ESP32)
├── Arduino Core
├── WiFi Library
├── HTTPClient
├── ArduinoJson
├── ESP32Servo
├── LiquidCrystal_I2C
└── Wire (I2C)

SENSORS & ACTUATORS
├── HC-SR04 Ultrasonic (x2)
├── SG90 Servo Motor
├── LCD 16x2 I2C
├── Buzzer
└── IR Lamp
```

---

## 🔄 Real-time Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   REAL-TIME UPDATES                              │
└─────────────────────────────────────────────────────────────────┘

ESP32 INSERT Transaction
         │
         ▼
┌────────────────────┐
│  Supabase DB       │
│  INSERT INTO       │
│  transactions      │
└────────┬───────────┘
         │
         ├─► TRIGGER: auto_update_points
         │   UPDATE profiles.total_points
         │
         ├─► Real-time Broadcast
         │   WebSocket notification
         │
         ▼
┌────────────────────┐
│  Dashboard         │
│  (Auto-refresh)    │
│                    │
│  • New transaction │
│  • Updated points  │
│  • New leaderboard │
└────────────────────┘

Refresh Interval: 30 seconds
WebSocket: Real-time (instant)
```

---

## 📈 Scalability Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   CURRENT vs SCALABLE                            │
└─────────────────────────────────────────────────────────────────┘

CURRENT (1-10 devices):
┌──────────┐     ┌──────────┐     ┌──────────┐
│  ESP32   │────►│ Supabase │◄────│ Next.js  │
│  Direct  │     │  Direct  │     │  Vercel  │
└──────────┘     └──────────┘     └──────────┘

SCALABLE (10+ devices):
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  ESP32   │────►│ AWS IoT  │────►│ Lambda   │────►│ Supabase │
│  MQTT    │     │  Core    │     │ Process  │     │ Database │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                           │
                                                           ▼
                                                    ┌──────────┐
                                                    │ Next.js  │
                                                    │ Vercel   │
                                                    └──────────┘
```

---

## 🎯 Summary

### Current Architecture Strengths:
✅ Simple and maintainable  
✅ Low latency (direct connection)  
✅ Cost-effective (Supabase free tier)  
✅ Real-time updates  
✅ Easy to debug  
✅ Perfect for 1-10 devices  

### When to Scale:
- 10+ devices → Consider AWS IoT Core
- Complex logic → Add Edge Functions
- High traffic → Add CDN (Vercel)
- Analytics → Add data warehouse

---

**Created:** 6 Mei 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
