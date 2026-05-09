# ⚡ AWS Quick Start - Bank Sampah Digital IoT

## 🎯 Pilih Opsi Anda

### **Opsi 1: AWS IoT Core** (Enterprise-grade)
- ✅ Best for: Multiple devices, MQTT, security
- ⏱️ Setup time: 2-3 hours
- 💰 Cost: Free tier (250K messages/month)
- 🎓 Difficulty: ⭐⭐⭐ Advanced

### **Opsi 2: AWS Lambda + API Gateway** (Simple)
- ✅ Best for: Simple API, serverless
- ⏱️ Setup time: 1 hour
- 💰 Cost: Free tier (1M requests/month)
- 🎓 Difficulty: ⭐⭐ Medium

### **Opsi 3: Tetap Supabase** (Current)
- ✅ Best for: Small scale, quick development
- ⏱️ Setup time: Already done!
- 💰 Cost: Free tier
- 🎓 Difficulty: ⭐ Easy

---

## 🚀 Quick Start: AWS Lambda + API Gateway

### **Step 1: Create Lambda Function (5 menit)**

1. **Login AWS Console** → Lambda → Create Function
2. **Function name:** `IoTTransactionHandler`
3. **Runtime:** Node.js 18.x
4. **Code:**

```javascript
exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    
    console.log('Transaction:', body);
    
    // TODO: Save to database
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Success',
            data: body
        })
    };
};
```

5. **Deploy**

### **Step 2: Create API Gateway (5 menit)**

1. **API Gateway** → Create API → REST API
2. **API name:** `IoTAPI`
3. **Create Resource:** `/transactions`
4. **Create Method:** POST
5. **Integration:** Lambda → Select `IoTTransactionHandler`
6. **Deploy API** → Stage: `prod`
7. **Copy Invoke URL:** `https://abc123.execute-api.ap-southeast-1.amazonaws.com/prod`

### **Step 3: Update ESP32 Code (5 menit)**

```cpp
const char* aws_api = "https://abc123.execute-api.ap-southeast-1.amazonaws.com/prod/transactions";

void sendToAWS(const char* user_id, int points) {
  HTTPClient http;
  http.begin(aws_api);
  http.addHeader("Content-Type", "application/json");

  String json = "{\"user_id\":\"" + String(user_id) + 
                "\",\"device_id\":\"ESP32-BOTOL-01\"," +
                "\"points_earned\":" + String(points) + "}";

  int code = http.POST(json);
  Serial.printf("AWS Response: %d\n", code);
  http.end();
}
```

### **Step 4: Test (2 menit)**

1. Upload code ke ESP32
2. Masukkan botol
3. Cek CloudWatch Logs di AWS Console

**Done!** ✅

---

## 💡 Rekomendasi

### **Untuk Project Anda Sekarang:**

```
❌ JANGAN pindah ke AWS dulu
✅ TETAP pakai Supabase

Alasan:
- Sudah working dengan baik
- Lebih simple & maintainable
- Free tier Supabase cukup
- Tidak perlu complexity AWS
```

### **Kapan Harus Pindah ke AWS?**

✅ **Jika:**
- Punya 10+ devices
- Butuh enterprise security
- Butuh device management
- Butuh MQTT protocol
- Butuh advanced analytics

❌ **Jika:**
- Masih 1-5 devices
- Project masih development
- Budget terbatas
- Team belum familiar AWS

---

## 📊 Comparison

| Feature | Supabase | AWS |
|---------|----------|-----|
| **Setup Time** | ✅ 30 min | ❌ 2-3 hours |
| **Complexity** | ✅ Simple | ❌ Complex |
| **Cost (Small)** | ✅ Free | ✅ Free (tier) |
| **Scalability** | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| **Learning Curve** | ✅ Easy | ❌ Steep |
| **Maintenance** | ✅ Low | ⭐⭐ Medium |

---

## 🎯 Final Recommendation

**Untuk sekarang:** ✅ **TETAP SUPABASE**

**Nanti (jika scaling):** 
1. Coba AWS Lambda + API Gateway dulu
2. Jika butuh MQTT → Upgrade ke AWS IoT Core

**Focus pada:**
- Improve features
- Better UX
- More users
- Bukan migrate infrastructure

---

**File lengkap:** `AWS_INTEGRATION_GUIDE.md` untuk detail setup!
