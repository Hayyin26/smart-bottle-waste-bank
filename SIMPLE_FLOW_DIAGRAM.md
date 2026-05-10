# 📊 Diagram Alur Sistem - Bank Sampah Digital IoT

## 🎯 Alur Sederhana (Mode Simple)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR TRANSAKSI SIMPLE                         │
└─────────────────────────────────────────────────────────────────┘

USER                ESP32               SUPABASE            DASHBOARD
 │                    │                     │                   │
 │  1. Bawa botol     │                     │                   │
 ├──────────────────► │                     │                   │
 │                    │                     │                   │
 │                    │  2. Sensor deteksi  │                   │
 │                    │     ukuran botol    │                   │
 │                    │                     │                   │
 │                    │  3. Validasi:       │                   │
 │                    │     Valid? ✓        │                   │
 │                    │     Gate buka       │                   │
 │                    │                     │                   │
 │  4. Masukkan       │                     │                   │
 │     botol          │                     │                   │
 ├──────────────────► │                     │                   │
 │                    │                     │                   │
 │                    │  5. Botol lewat     │                   │
 │                    │     Gate tutup      │                   │
 │                    │                     │                   │
 │                    │  6. POST /transactions                  │
 │                    ├────────────────────►│                   │
 │                    │  {user_id, points}  │                   │
 │                    │                     │                   │
 │                    │                     │  7. INSERT data   │
 │                    │                     │     TRIGGER run   │
 │                    │                     │     Points +10    │
 │                    │                     │                   │
 │                    │  8. Response 201 ✓  │                   │
 │                    │◄────────────────────┤                   │
 │                    │                     │                   │
 │  9. LCD: +10 POINT │                     │                   │
 │     SUCCESS!       │                     │                   │
 │◄───────────────────┤                     │                   │
 │                    │                     │                   │
 │                    │                     │  10. Auto-refresh │
 │                    │                     ├──────────────────►│
 │                    │                     │                   │
 │                    │                     │                   │  11. Update UI
 │                    │                     │                   │      - Leaderboard
 │                    │                     │                   │      - Stats
 │                    │                     │                   │      - Transactions
 │                    │                     │                   │
```

---

## 🎯 Alur Lengkap (Mode QR Login)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ALUR TRANSAKSI QR LOGIN                       │
└─────────────────────────────────────────────────────────────────┘

=== FASE 1: SETUP ===

ADMIN              WEB DASHBOARD        SUPABASE
 │                      │                   │
 │  1. Buka /qr-login   │                   │
 ├─────────────────────►│                   │
 │                      │                   │
 │  2. Generate QR      │                   │
 │     Device: ESP32    │                   │
 │     Token: abc123... │                   │
 │◄─────────────────────┤                   │
 │                      │                   │
 │  3. Print QR         │                   │
 │     Tempel di device │                   │
 │                      │                   │

=== FASE 2: USER LOGIN ===

USER               SMARTPHONE          WEB SERVER         SUPABASE
 │                      │                   │                 │
 │  4. Scan QR          │                   │                 │
 ├─────────────────────►│                   │                 │
 │                      │                   │                 │
 │                      │  5. Open URL      │                 │
 │                      │  /iot-auth?token  │                 │
 │                      ├──────────────────►│                 │
 │                      │                   │                 │
 │  6. Login form       │                   │                 │
 │     Email: xxx       │                   │                 │
 │     Password: xxx    │                   │                 │
 │◄─────────────────────┤                   │                 │
 │                      │                   │                 │
 │  7. Submit           │                   │                 │
 ├─────────────────────►│  8. Verify user   │                 │
 │                      ├──────────────────►│  9. Check auth  │
 │                      │                   ├────────────────►│
 │                      │                   │                 │
 │                      │                   │  10. User valid │
 │                      │                   │◄────────────────┤
 │                      │                   │                 │
 │                      │                   │  11. Save session
 │                      │                   │  INSERT iot_sessions
 │                      │                   ├────────────────►│
 │                      │                   │                 │
 │  12. Success page    │                   │                 │
 │      "Login Berhasil"│                   │                 │
 │◄─────────────────────┤                   │                 │
 │                      │                   │                 │

=== FASE 3: ESP32 GET USER ===

ESP32              API SERVER          SUPABASE
 │                      │                   │
 │  13. GET /api/iot/get-user?token=abc123 │
 ├─────────────────────►│                   │
 │                      │                   │
 │                      │  14. Query session│
 │                      ├──────────────────►│
 │                      │  SELECT user_id   │
 │                      │  FROM iot_sessions│
 │                      │                   │
 │                      │  15. Return data  │
 │                      │◄──────────────────┤
 │                      │  {user_id, name}  │
 │                      │                   │
 │  16. User data       │                   │
 │◄─────────────────────┤                   │
 │  {id: xxx,           │                   │
 │   name: "John Doe"}  │                   │
 │                      │                   │
 │  17. LCD: "HELLO!"   │                   │
 │          "John Doe"  │                   │
 │                      │                   │

=== FASE 4: TRANSAKSI ===

USER               ESP32               SUPABASE           DASHBOARD
 │                    │                     │                  │
 │  18. Masukkan      │                     │                  │
 │      botol         │                     │                  │
 ├───────────────────►│                     │                  │
 │                    │                     │                  │
 │                    │  19. Deteksi valid  │                  │
 │                    │      Gate buka      │                  │
 │                    │                     │                  │
 │                    │  20. POST /transactions                │
 │                    ├────────────────────►│                  │
 │                    │  {user_id: xxx,     │                  │
 │                    │   device_id: ESP32, │                  │
 │                    │   points: 10}       │                  │
 │                    │                     │                  │
 │                    │                     │  21. INSERT      │
 │                    │                     │      TRIGGER     │
 │                    │                     │      UPDATE      │
 │                    │                     │      John Doe    │
 │                    │                     │      points +10  │
 │                    │                     │                  │
 │                    │  22. Response 201   │                  │
 │                    │◄────────────────────┤                  │
 │                    │                     │                  │
 │  23. LCD: +10      │                     │                  │
 │      SUCCESS!      │                     │                  │
 │      John Doe      │                     │                  │
 │◄───────────────────┤                     │                  │
 │                    │                     │                  │
 │                    │                     │  24. Auto-refresh│
 │                    │                     ├─────────────────►│
 │                    │                     │                  │
 │                    │                     │                  │  25. Update
 │                    │                     │                  │      John Doe
 │                    │                     │                  │      points: 60
 │                    │                     │                  │
```

---

## 🗄️ Database Trigger Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE TRIGGER FLOW                         │
└─────────────────────────────────────────────────────────────────┘

ESP32 POST Request
       │
       ▼
┌──────────────────┐
│  Supabase API    │
│  /rest/v1/       │
│  transactions    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  INSERT INTO transactions            │
│  VALUES (                            │
│    user_id: 'xxx',                   │
│    device_id: 'ESP32-BOTOL-01',      │
│    points_earned: 10                 │
│  )                                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  TRIGGER: trigger_auto_update_points │
│  Event: AFTER INSERT                 │
│  For Each Row                        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  FUNCTION: auto_update_user_points() │
│                                      │
│  UPDATE profiles                     │
│  SET total_points =                  │
│      total_points + NEW.points_earned│
│  WHERE id = NEW.user_id              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  profiles table updated              │
│  User points: 50 → 60                │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Response 201 Created                │
│  Return to ESP32                     │
└──────────────────────────────────────┘
```

---

## 🌐 Web Dashboard Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB DASHBOARD STRUCTURE                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                          │
│  ├─ Logo                                                         │
│  ├─ Dashboard                                                    │
│  ├─ Users                                                        │
│  ├─ Transactions                                                 │
│  ├─ Reports                                                      │
│  └─ QR Generator                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DASHBOARD PAGE                                                  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Total   │  │  Total   │  │  Points  │  │   IoT    │       │
│  │  Users   │  │  Scans   │  │  Distrib │  │ Devices  │       │
│  │   150    │  │   1,234  │  │  12,340  │  │    1     │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌────────────────────────────┐  ┌──────────────────────┐      │
│  │  RECENT TRANSACTIONS       │  │  DEVICE STATUS       │      │
│  │  ┌──────────────────────┐  │  │  ┌────────────────┐ │      │
│  │  │ John Doe   +10  2m   │  │  │  │ ESP32-BOTOL-01 │ │      │
│  │  │ Jane Smith +10  5m   │  │  │  │ Status: Online │ │      │
│  │  │ Bob Wilson +10  8m   │  │  │  │ Location: Lab  │ │      │
│  │  └──────────────────────┘  │  │  └────────────────┘ │      │
│  └────────────────────────────┘  │                      │      │
│                                   │  LEADERBOARD         │      │
│                                   │  ┌────────────────┐ │      │
│                                   │  │ 🥇 John Doe    │ │      │
│                                   │  │    150 points  │ │      │
│                                   │  │ 🥈 Jane Smith  │ │      │
│                                   │  │    120 points  │ │      │
│                                   │  │ 🥉 Bob Wilson  │ │      │
│                                   │  │    100 points  │ │      │
│                                   │  └────────────────┘ │      │
│                                   └──────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Machine (ESP32)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESP32 STATE MACHINE                           │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │  POWER ON    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  WiFi Connect│
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Initialize  │
                    │  Hardware    │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Check Mode  │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
         ┌─────────────┐      ┌─────────────┐
         │ Simple Mode │      │ QR Login    │
         │             │      │ Mode        │
         └──────┬──────┘      └──────┬──────┘
                │                     │
                │                     ▼
                │              ┌─────────────┐
                │              │ WAIT_USER   │◄──┐
                │              │ (Scan QR)   │   │
                │              └──────┬──────┘   │
                │                     │          │
                │                     │ Token    │
                │                     │ received │
                │                     ▼          │
                │              ┌─────────────┐   │
                │              │ Get User ID │   │
                │              │ from API    │   │
                │              └──────┬──────┘   │
                │                     │          │
                │                     │ Success  │
                │                     ▼          │
                └────────────►┌─────────────┐   │
                              │ WAIT_BOTTLE │◄──┤
                              │ (Ready)     │   │
                              └──────┬──────┘   │
                                     │          │
                              Bottle │          │
                              detected         │
                                     ▼          │
                              ┌─────────────┐   │
                              │ Validate    │   │
                              │ Size        │   │
                              └──────┬──────┘   │
                                     │          │
                        ┌────────────┴────────┐ │
                        │                     │ │
                   Valid│                Invalid│
                        ▼                     ▼ │
                 ┌─────────────┐      ┌─────────────┐
                 │ WAIT_PASS   │      │ REJECT_HOLD │
                 │ (Gate Open) │      │ (Rejected)  │
                 └──────┬──────┘      └──────┬──────┘
                        │                     │
                 Bottle │                     │ 1.5s
                 passed │                     │ timeout
                        ▼                     │
                 ┌─────────────┐              │
                 │ Send to     │              │
                 │ Supabase    │              │
                 └──────┬──────┘              │
                        │                     │
                        │ Success             │
                        ▼                     │
                 ┌─────────────┐              │
                 │ Show        │              │
                 │ Success     │              │
                 └──────┬──────┘              │
                        │                     │
                        └─────────────────────┘
                                │
                                │
                        ┌───────┴────────┐
                        │                │
                   Simple│           QR Login
                   Mode  │           Mode
                        │                │
                        ▼                ▼
                 ┌─────────────┐  ┌─────────────┐
                 │ Back to     │  │ Check       │
                 │ WAIT_BOTTLE │  │ Session     │
                 └─────────────┘  └──────┬──────┘
                                         │
                                  ┌──────┴──────┐
                                  │             │
                            Valid │       Expired
                                  │             │
                                  ▼             ▼
                           WAIT_BOTTLE    WAIT_USER
```

---

## 📱 QR Code System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    QR CODE SYSTEM FLOW                           │
└─────────────────────────────────────────────────────────────────┘

ADMIN                                USER
  │                                    │
  │ 1. Generate QR                     │
  │    /qr-login                       │
  │    ├─ Device: ESP32-BOTOL-01       │
  │    └─ Token: abc123...             │
  │                                    │
  │ 2. Print QR                        │
  │    ┌─────────────┐                 │
  │    │  ▓▓▓▓▓▓▓▓▓  │                 │
  │    │  ▓       ▓  │                 │
  │    │  ▓ QR    ▓  │                 │
  │    │  ▓       ▓  │                 │
  │    │  ▓▓▓▓▓▓▓▓▓  │                 │
  │    └─────────────┘                 │
  │                                    │
  │ 3. Tempel di device                │
  │    ┌─────────────┐                 │
  │    │   ESP32     │                 │
  │    │   Device    │                 │
  │    │             │                 │
  │    │  [QR Code]  │                 │
  │    └─────────────┘                 │
  │                                    │
  │                                    │ 4. Scan QR
  │                                    │    dengan
  │                                    │    smartphone
  │                                    │
  │                                    │ 5. Browser buka
  │                                    │    /iot-auth
  │                                    │
  │                                    │ 6. Login/Register
  │                                    │    ┌──────────┐
  │                                    │    │ Email    │
  │                                    │    │ Password │
  │                                    │    │ [Login]  │
  │                                    │    └──────────┘
  │                                    │
  │                                    │ 7. Session saved
  │                                    │    to database
  │                                    │
  │                                    │ 8. Success page
  │                                    │    "Login Berhasil!"
  │                                    │
  │                                    │ 9. Masukkan botol
  │                                    │    ke device
  │                                    │
  │                                    │ 10. Points +10
  │                                    │     ke akun user
  │                                    │
```

---

## 🎯 Summary

### **Mode Simple:**
```
User → Botol → ESP32 → Supabase → Dashboard
                ↓
         Default User ID
```

### **Mode QR Login:**
```
User → Scan QR → Login → Session → ESP32 → Supabase → Dashboard
                                      ↓
                               User's Own ID
```

### **Key Difference:**
- **Simple:** Semua transaksi pakai 1 user ID
- **QR Login:** Setiap user punya akun sendiri

### **Database Flow:**
```
INSERT transaction → TRIGGER → UPDATE points → Dashboard refresh
```

### **Real-time Update:**
```
Database change → Auto-refresh (30s) → UI update
```
