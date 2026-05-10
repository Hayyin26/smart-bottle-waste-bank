# 🔧 Hydration Error - FIXED!

## ❌ Error yang Terjadi:

```
Error: A tree hydrated but some attributes of the server rendered HTML 
didn't match the client properties.
```

## 🔍 Penyebab:

Error ini terjadi karena:

1. **`useEffect` dipanggil saat component mount**
2. **`window.location.origin` digunakan di server-side**
3. **Server render berbeda dengan client render**

### Code Bermasalah:
```typescript
useEffect(() => {
  // Auto-generate QR on load
  generatePermanentQR(); // ❌ Langsung dipanggil
}, []);

async function generatePermanentQR() {
  const url = `${window.location.origin}/iot-auth?device=${deviceId}`;
  // ❌ window.location tidak ada di server
}
```

## ✅ Solusi:

### 1. Tambah `mounted` State
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);
```

### 2. Generate QR Hanya di Client
```typescript
useEffect(() => {
  // Auto-generate QR on load (only on client)
  if (mounted) {
    generatePermanentQR();
  }
}, [mounted]);
```

### 3. Guard di Function
```typescript
async function generatePermanentQR() {
  if (!mounted) return; // ✅ Don't run on server
  
  setLoading(true);
  try {
    const url = `${window.location.origin}/iot-auth?device=${deviceId}`;
    // ... rest of code
  }
}
```

### 4. Conditional Render
```typescript
return (
  <div>
    {!mounted ? (
      // Show loading on server
      <div>Loading...</div>
    ) : (
      // Show content on client
      <div>
        {/* QR code content */}
      </div>
    )}
  </div>
);
```

## 🎯 Hasil:

✅ **No more hydration error!**
✅ **Server render: Loading state**
✅ **Client render: Full content**
✅ **QR code generates correctly**

## 📝 Penjelasan Teknis:

### Server-Side Rendering (SSR):
```
1. Next.js render component di server
2. Generate HTML
3. Send HTML ke browser
4. Browser show HTML (fast!)
```

### Client-Side Hydration:
```
1. React "hydrate" HTML di browser
2. Attach event handlers
3. Make it interactive
```

### Problem:
```
Server HTML: <div>Loading...</div>
Client HTML: <div><img src="qr-code" /></div>

❌ Mismatch! React complains!
```

### Solution:
```
Server HTML: <div>Loading...</div>
Client HTML: <div>Loading...</div> (first render)
           → <div><img src="qr-code" /></div> (after mounted)

✅ Match! React happy!
```

## 🔄 Flow Diagram:

```
┌─────────────────────────────────────────┐
│         SERVER SIDE RENDER              │
├─────────────────────────────────────────┤
│ 1. Component renders                    │
│ 2. mounted = false                      │
│ 3. Show loading state                   │
│ 4. Generate HTML                        │
│ 5. Send to browser                      │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         CLIENT SIDE HYDRATION           │
├─────────────────────────────────────────┤
│ 1. React hydrate HTML                   │
│ 2. mounted = false (match server!)      │
│ 3. Show loading state (match!)          │
│ 4. useEffect runs                       │
│ 5. setMounted(true)                     │
│ 6. Re-render with mounted = true        │
│ 7. Generate QR code                     │
│ 8. Show QR code                         │
└─────────────────────────────────────────┘
```

## 🧪 Testing:

### Before Fix:
```bash
npm run dev
# Open http://localhost:3000/device-qr
# ❌ Console error: Hydration mismatch
# ❌ Warning in browser
```

### After Fix:
```bash
npm run dev
# Open http://localhost:3000/device-qr
# ✅ No errors
# ✅ Loading state briefly
# ✅ QR code appears
# ✅ Everything works!
```

## 📚 Best Practices:

### ✅ DO:
```typescript
// Use mounted state
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// Conditional render
{mounted && <ClientOnlyComponent />}
```

### ❌ DON'T:
```typescript
// Don't use window directly in render
const url = window.location.href; // ❌

// Don't use Date.now() in render
const timestamp = Date.now(); // ❌

// Don't use Math.random() in render
const random = Math.random(); // ❌
```

## 🎯 Summary:

**Problem:** Server render ≠ Client render
**Solution:** Make them match initially, then update on client
**Result:** No hydration error! ✅

---

**Fixed:** 6 Mei 2026  
**Status:** Working! ✅
