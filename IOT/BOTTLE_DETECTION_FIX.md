# 🔧 FIX: Sistem Terus Mengukur Botol Berulang

## ❌ MASALAH

```
1. Botol masuk → Terdeteksi ukuran SEDANG
2. Sistem belum kirim data
3. Sistem mengukur lagi... lagi... lagi...
4. LCD berubah-ubah terus
5. Tidak pernah buka gate & kirim data
```

## 🔍 ROOT CAUSE

### Problem 1: `OBJECT_PRESENT_CM` Terlalu Besar!

```cpp
#define OBJECT_PRESENT_CM 35  // ← MASALAH!
```

**Dengan offset HEIGHT=20cm, LENGTH=35cm:**

```
Botol diameter 7cm, panjang 19cm:
- Sensor HEIGHT baca: 20-7 = 13cm (raw distance)
- Sensor LENGTH baca: 35-19 = 16cm (raw distance)

Condition bottlePresent:
- heightCm (7cm) <= OBJECT_PRESENT_CM (35cm)  → TRUE ✅
- lengthCm (19cm) <= OBJECT_PRESENT_CM (35cm) → TRUE ✅

Result: bottlePresent = TRUE (correct)
```

**TAPI... setelah offset conversion:**

Logic salah! Kita compare BOTTLE SIZE dengan OBJECT_PRESENT threshold!

```cpp
// CODE SEKARANG (SALAH):
bool bottlePresent = (heightCm > 0 && heightCm <= OBJECT_PRESENT_CM) || 
                     (lengthCm > 0 && lengthCm <= OBJECT_PRESENT_CM);

// heightCm = bottle diameter (setelah conversion)
// OBJECT_PRESENT_CM = 35cm

// Contoh: Botol diameter 7cm
// bottlePresent = (7 > 0 && 7 <= 35) → TRUE ✅

// Tapi ini SELALU TRUE untuk semua botol!
// Karena botol diameter max = 11cm, panjang max = 32cm
// Semua < 35cm!
```

### Problem 2: Logic Detection Salah!

Setelah conversion, kita tidak lagi pakai "raw distance", tapi "bottle size".

**Logic yang benar:**
- Bottle present = Ada reading yang valid (bukan -1)
- Bottle gone = Semua reading invalid (-1)

**Bukan:**
- ~~Bottle present = size < 35cm~~ ❌

---

## ✅ SOLUSI

### Fix 1: Update Detection Logic

```cpp
// SEBELUM (SALAH):
bool bottlePresent = (heightCm > 0 && heightCm <= OBJECT_PRESENT_CM) || 
                     (lengthCm > 0 && lengthCm <= OBJECT_PRESENT_CM);
bool bottleGone = ((heightCm < 0 || heightCm >= OBJECT_GONE_CM) && 
                   (lengthCm < 0 || lengthCm >= OBJECT_GONE_CM));

// SETELAH (BENAR):
// Botol present = ada ukuran valid (tidak -1)
// Menggunakan threshold yang masuk akal untuk bottle SIZE
bool bottlePresent = (heightCm >= 3 && heightCm <= 15) || 
                     (lengthCm >= 8 && lengthCm <= 35);

// Botol gone = semua sensor invalid atau jauh
bool bottleGone = (heightCm < 0 || heightCm < 3) && 
                  (lengthCm < 0 || lengthCm < 8);
```

**Reasoning:**
- Diameter botol: 3-15cm (range valid)
- Panjang botol: 8-35cm (range valid)
- Jika diameter <3cm atau panjang <8cm = botol sudah lewat/gone

---

### Fix 2: Add "One-Shot" Detection

Tambahkan flag untuk prevent repeated classification:

```cpp
// Global variable
static bool bottleProcessed = false;

// Di WAIT_BOTTLE state:
if (bottlePresent && !bottleProcessed && (millis() - lastDecisionAt > DECISION_COOLDOWN_MS)) {
    // Process bottle (classify, open gate, etc.)
    bottleProcessed = true;  // ← Mark as processed
    // ...
}

// Di WAIT_PASS state (setelah botol lewat):
if (bottleGone) {
    // Send data, close gate
    bottleProcessed = false;  // ← Reset for next bottle
    // ...
}
```

---

## 📊 COMPARISON

### SEBELUM FIX:

```
Botol masuk:
  ↓
heightCm=7, lengthCm=19
  ↓
bottlePresent = (7 <= 35 || 19 <= 35) = TRUE
  ↓
Classify → SEDANG
  ↓
(Loop continues...)
  ↓
heightCm=7, lengthCm=19  ← MASIH BACA SAMA!
  ↓
bottlePresent = TRUE lagi!  ← DETECT LAGI!
  ↓
Classify → SEDANG lagi
  ↓
(Loop terus berulang...)
```

### SETELAH FIX:

```
Botol masuk:
  ↓
heightCm=7, lengthCm=19
  ↓
bottlePresent = (7 in 3-15 || 19 in 8-35) = TRUE
bottleProcessed = false
  ↓
Classify → SEDANG
Open gate
bottleProcessed = TRUE  ← MARK PROCESSED!
  ↓
(Loop continues...)
  ↓
heightCm=7, lengthCm=19
  ↓
bottlePresent = TRUE
BUT bottleProcessed = TRUE  ← SKIP!
  ↓
(Tunggu botol lewat...)
  ↓
Botol lewat → bottleGone = TRUE
  ↓
Send data
Close gate
bottleProcessed = FALSE  ← RESET!
  ↓
Ready for next bottle
```

---

## 🔧 IMPLEMENTATION

### Update 1: Fix Detection Logic

```cpp
// Update detection condition
bool bottlePresent = (heightCm >= 3 && heightCm <= 15) || 
                     (lengthCm >= 8 && lengthCm <= 35);

bool bottleGone = (heightCm < 0 || heightCm < 3) && 
                  (lengthCm < 0 || lengthCm < 8);
```

### Update 2: Add One-Shot Flag

```cpp
// Add global variable (di atas loop())
static bool bottleProcessed = false;

// Update WAIT_BOTTLE condition
if (bottlePresent && !bottleProcessed && (millis() - lastDecisionAt > DECISION_COOLDOWN_MS)) {
    // ... classify bottle ...
    
    if (currentBottleSize != NONE) {
        openGate();
        bottleProcessed = true;  // ← TAMBAHKAN INI!
        // ... rest of code ...
    } else {
        // Rejected
        bottleProcessed = true;  // ← TAMBAHKAN INI JUGA!
        // ... rest of code ...
    }
}

// Update WAIT_PASS state
if (bottleGone && (millis() - stateStartedAt > 1000)) {
    // ... send data ...
    
    bottleProcessed = false;  // ← RESET FLAG!
    
    // ... rest of code ...
}

// Update REJECT_HOLD state
if (millis() - stateStartedAt > REJECT_HOLD_MS) {
    bottleProcessed = false;  // ← RESET FLAG!
    gateState = WAIT_BOTTLE;
}
```

---

## 🧪 TESTING

### Test 1: Normal Bottle (SEDANG)

**Expected Flow:**
```
1. Botol masuk
   [Sensor] H=7cm, L=19cm
   
2. Detect pertama kali:
   bottlePresent=TRUE, bottleProcessed=FALSE
   → Classify: SEDANG
   → Open gate
   → bottleProcessed=TRUE
   
3. Loop continues (botol masih di sensor):
   bottlePresent=TRUE, bottleProcessed=TRUE
   → SKIP! (tidak classify lagi)
   
4. Botol lewat:
   bottleGone=TRUE
   → Send data
   → bottleProcessed=FALSE
   
5. Ready for next bottle
```

### Test 2: Rejected Bottle (Metal)

**Expected Flow:**
```
1. Botol masuk
   [Sensor] H=7cm, L=19cm, Metal=DETECTED
   
2. Detect:
   → Reject (metal)
   → bottleProcessed=TRUE
   
3. Loop (botol masih di sensor):
   → SKIP! (tidak detect lagi)
   
4. REJECT_HOLD timeout:
   → bottleProcessed=FALSE
   → Ready for next
```

---

## ⚠️ EDGE CASES

### Case 1: Sensor Fluktuasi

**Problem:**
```
Reading 1: H=7, L=19  → Present
Reading 2: H=-1, L=19 → Gone? (sensor error)
Reading 3: H=7, L=19  → Present lagi?
```

**Solution:**
```cpp
// Require BOTH sensors stable
bool bottlePresent = (heightCm >= 3 && heightCm <= 15) && 
                     (lengthCm >= 8 && lengthCm <= 35);
                     //  ↑ AND bukan OR!
```

**Alternative (lebih robust):**
```cpp
// Require consecutive stable readings
static int stableCount = 0;

if ((heightCm >= 3 && heightCm <= 15) && (lengthCm >= 8 && lengthCm <= 35)) {
    stableCount++;
} else {
    stableCount = 0;
}

bool bottlePresent = (stableCount >= 3);  // 3 readings berturut-turut
```

---

### Case 2: Botol Terlalu Cepat

**Problem:**
```
Botol masuk & keluar < 1 detik
→ bottleGone belum trigger
→ Data tidak terkirim
```

**Solution:**
```cpp
// Already handled by DECISION_COOLDOWN_MS
// Dan WAIT_PASS state wait 1 second
```

---

## ✅ CHECKLIST

- [ ] Update `bottlePresent` logic
- [ ] Update `bottleGone` logic
- [ ] Add `bottleProcessed` flag (global static)
- [ ] Add check `!bottleProcessed` di WAIT_BOTTLE
- [ ] Set `bottleProcessed=true` setelah classify
- [ ] Reset `bottleProcessed=false` di WAIT_PASS & REJECT_HOLD
- [ ] Test dengan botol real

---

## 📝 ALTERNATIVE: Simpler Fix

Jika tidak mau ubah banyak, bisa pakai fix sederhana:

```cpp
// Di WAIT_BOTTLE, tambahkan delay setelah classify:
if (currentBottleSize != NONE) {
    openGate();
    // ... rest ...
    
    delay(2000);  // ← TAMBAHKAN: Tunggu 2 detik sebelum detect lagi
}
```

**Tapi ini kurang elegant karena:**
- Block execution
- Tidak responsive
- Better pakai flag approach

---

**Fix ini akan membuat sistem hanya classify SEKALI per botol!** 🎯
