#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>  // ← TAMBAHAN: Untuk HTTP server
#include <HX711.h>      // ← TAMBAHAN: Library untuk load cell

// --- KONFIGURASI WIFI & SUPABASE ---
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";
const char* supabase_url = "https://dsdtxqpzofrvzxpyktoo.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk";
const char* device_id = "ESP32-BOTOL-01";

// --- MODE OPERASI ---
// PENTING: Set true untuk wajib QR login, false untuk default user
#define USE_QR_LOGIN true  // ← Set true = Wajib scan QR, false = Langsung pakai default user

// Default user ID (HANYA digunakan jika USE_QR_LOGIN = false)
// Jika USE_QR_LOGIN = true, baris ini diabaikan
const char* default_user_id = "9db3ac82-dc1c-4f28-abe2-a8482986735f";

// ⚠️ PENTING: Ganti dengan URL production atau IP lokal yang benar!
// Production: "https://your-domain.vercel.app/api/iot/get-user"
// Local: "http://192.168.1.7:3000/api/iot/get-user"
const char* api_get_user = "https://smart-bottle-waste-bank.vercel.app/api/iot/get-user";

// Session variables
String session_token = "";
String current_user_id = "";
String current_user_name = "";
unsigned long lastSessionCheck = 0;
#define SESSION_CHECK_INTERVAL 10000 // Check every 10 seconds (lebih responsif)

unsigned long lastIpRegistration = 0;
#define IP_REGISTRATION_INTERVAL 300000 // Re-register IP every 5 minutes (300000ms)

// --- KONFIGURASI PIN ---
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 12      // ← Ubah dari 14 ke 12 (pin yang lebih stabil)
#define PIN_SERVO 19
#define PIN_BUZZER 23
#define PIN_IR_LAMP 13
#define PIN_METAL_SENSOR 25      // Sensor proximity metal (digital input)
#define PIN_LOADCELL_DOUT 26     // Load cell data pin (HX711)
#define PIN_LOADCELL_SCK 27      // Load cell clock pin (HX711)

// --- KONFIGURASI SERVO ---
#define SERVO_OPEN_ANGLE 90
#define SERVO_CLOSE_ANGLE 0

// --- KLASIFIKASI UKURAN BOTOL (cm) ---
// ⚠️ PENTING: Botol diletakkan HORIZONTAL (tidur)
// - Sensor HEIGHT mengukur DIAMETER botol
// - Sensor LENGTH mengukur PANJANG botol
// - Load Cell mengukur BERAT botol (gram)

// Botol KECIL (contoh: botol air mineral 330ml)
// Panjang: 15-20cm, Diameter: 5-7cm, Berat: 12.5-18g
#define SMALL_HEIGHT_MIN 5      // Diameter min (sensor HEIGHT)
#define SMALL_HEIGHT_MAX 11     // Diameter max
#define SMALL_LENGTH_MIN 8     // Panjang min (sensor LENGTH)
#define SMALL_LENGTH_MAX 13     // Panjang max
#define SMALL_WEIGHT_MIN 12.5   // Berat min (gram)
#define SMALL_WEIGHT_MAX 18.0   // Berat max (gram)
#define SMALL_POINTS 5

// Botol SEDANG (contoh: botol air mineral 600ml)
// Panjang: 20-25cm, Diameter: 6-8cm, Berat: 20-23g
#define MEDIUM_HEIGHT_MIN 12     // Diameter min (sensor HEIGHT)
#define MEDIUM_HEIGHT_MAX 16     // Diameter max
#define MEDIUM_LENGTH_MIN 15    // Panjang min (sensor LENGTH)
#define MEDIUM_LENGTH_MAX 20    // Panjang max
#define MEDIUM_WEIGHT_MIN 20.0  // Berat min (gram)
#define MEDIUM_WEIGHT_MAX 23.0  // Berat max (gram)
#define MEDIUM_POINTS 10

// Botol BESAR (contoh: botol air mineral 1.5L)
// Panjang: 25-35cm, Diameter: 8-11cm, Berat: 25-28g
#define LARGE_HEIGHT_MIN 18      // Diameter min (sensor HEIGHT)
#define LARGE_HEIGHT_MAX 22     // Diameter max
#define LARGE_LENGTH_MIN 21     // Panjang min (sensor LENGTH)
#define LARGE_LENGTH_MAX 30     // Panjang max
#define LARGE_WEIGHT_MIN 25.0   // Berat min (gram)
#define LARGE_WEIGHT_MAX 28.0   // Berat max (gram)
#define LARGE_POINTS 15

// Batas minimum dan maksimum keseluruhan
#define HEIGHT_MIN_CM SMALL_HEIGHT_MIN
#define HEIGHT_MAX_CM LARGE_HEIGHT_MAX
#define LENGTH_MIN_CM SMALL_LENGTH_MIN
#define LENGTH_MAX_CM LARGE_LENGTH_MAX

// --- PARAMETER DETEKSI ---
#define OBJECT_PRESENT_CM 35
#define OBJECT_GONE_CM 45
#define OPEN_TIMEOUT_MS 7000
#define REJECT_HOLD_MS 1500
#define DECISION_COOLDOWN_MS 1200

// --- PARAMETER STABILISASI SENSOR ---
#define SENSOR_MIN_VALID_CM 2
#define SENSOR_MAX_VALID_CM 350
#define SENSOR_SAMPLES 5
#define SENSOR_INTER_DELAY_MS 60

LiquidCrystal_I2C *lcd = nullptr;
bool lcdConnected = false;
Servo myservo;
WebServer server(80);  // ← TAMBAHAN: HTTP server di port 80
HX711 scale;           // ← TAMBAHAN: Load cell sensor

enum GateState { WAIT_USER, WAIT_BOTTLE, WAIT_PASS, REJECT_HOLD };
GateState gateState = WAIT_BOTTLE;

enum BottleSize { NONE, SMALL, MEDIUM, LARGE };

int points = 0;
int heightCm = -1;
int lengthCm = -1;
float weightGram = -1.0;        // ← TAMBAHAN: Berat botol
bool isMetalDetected = false;   // ← TAMBAHAN: Status deteksi metal
BottleSize currentBottleSize = NONE;
int currentBottlePoints = 0;
unsigned long stateStartedAt = 0;
unsigned long lastDecisionAt = 0;
unsigned long lampOnUntil = 0;
unsigned long lastSensorReadAt = 0;

// --- FUNGSI KLASIFIKASI UKURAN BOTOL (BARU!) ---
// ⚠️ WEIGHT DISABLED - Menggunakan hanya HEIGHT dan LENGTH
BottleSize classifyBottle(int height, int length, float weight) {
  // Validasi input (weight diabaikan untuk sementara)
  if (height < HEIGHT_MIN_CM || height > HEIGHT_MAX_CM || 
      length < LENGTH_MIN_CM || length > LENGTH_MAX_CM) {
    return NONE;
  }
  
  // Klasifikasi berdasarkan tinggi dan panjang SAJA
  // Weight check disabled for now
  
  // Botol KECIL
  if (height >= SMALL_HEIGHT_MIN && height < SMALL_HEIGHT_MAX && 
      length >= SMALL_LENGTH_MIN && length < SMALL_LENGTH_MAX) {
    return SMALL;
  }
  
  // Botol SEDANG
  if (height >= MEDIUM_HEIGHT_MIN && height < MEDIUM_HEIGHT_MAX && 
      length >= MEDIUM_LENGTH_MIN && length < MEDIUM_LENGTH_MAX) {
    return MEDIUM;
  }
  
  // Botol BESAR
  if (height >= LARGE_HEIGHT_MIN && height <= LARGE_HEIGHT_MAX && 
      length >= LARGE_LENGTH_MIN && length <= LARGE_LENGTH_MAX) {
    return LARGE;
  }
  
  return NONE;
}

const char* getBottleSizeName(BottleSize size) {
  switch (size) {
    case SMALL: return "KECIL";
    case MEDIUM: return "SEDANG";
    case LARGE: return "BESAR";
    default: return "UNKNOWN";
  }
}

int getBottlePoints(BottleSize size) {
  switch (size) {
    case SMALL: return SMALL_POINTS;
    case MEDIUM: return MEDIUM_POINTS;
    case LARGE: return LARGE_POINTS;
    default: return 0;
  }
}

// --- FUNGSI BACA SENSOR METAL (BARU!) ---
bool readMetalSensor() {
  // Sensor proximity metal biasanya LOW = terdeteksi, HIGH = tidak terdeteksi
  // Sesuaikan dengan jenis sensor yang digunakan
  return digitalRead(PIN_METAL_SENSOR) == LOW;
}

// --- FUNGSI BACA LOAD CELL (BARU!) ---
float readWeight() {
  if (scale.is_ready()) {
    // Baca berat dalam gram (rata-rata 5 pembacaan)
    float weight = scale.get_units(5);
    return weight > 0 ? weight : 0;
  }
  return -1.0;
}

// --- FUNGSI HAPUS SESSION (BARU!) ---
void deleteSession() {
  if (!USE_QR_LOGIN || session_token.length() == 0) return;
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  String url = String(api_get_user) + "?token=" + session_token;
  
  Serial.println("[API] Deleting session...");
  http.begin(url);
  http.setTimeout(5000);
  
  int httpResponseCode = http.sendRequest("DELETE");
  
  if (httpResponseCode == 200) {
    Serial.println("[Session] ✅ Session deleted");
    session_token = "";
    current_user_id = "";
    current_user_name = "";
    gateState = WAIT_USER;
  } else {
    Serial.printf("[Session] ❌ Failed to delete: %d\n", httpResponseCode);
  }
  
  http.end();
}

// --- FUNGSI GET USER ID DARI SESSION ---
bool getUserFromSession() {
  if (!USE_QR_LOGIN) return false;
  if (WiFi.status() != WL_CONNECTED) return false;
  if (session_token.length() == 0) return false;

  HTTPClient http;
  String url = String(api_get_user) + "?token=" + session_token + "&device=" + device_id;
  
  Serial.println("[API] Getting user from session...");
  Serial.println("[API] URL: " + url);
  
  http.begin(url);
  http.setTimeout(10000);  // Increase timeout to 10s
  
  int httpResponseCode = http.GET();
  
  Serial.println("[API] Response Code: " + String(httpResponseCode));
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    Serial.println("[API] Response: " + response);
    
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);
    
    if (!error) {
      current_user_id = doc["user_id"].as<String>();
      current_user_name = doc["full_name"].as<String>();
      Serial.println("[Session] ✅ User found!");
      Serial.println("[Session] User ID: " + current_user_id);
      Serial.println("[Session] Name: " + current_user_name);
      http.end();
      return true;
    } else {
      Serial.println("[API] JSON Parse Error: " + String(error.c_str()));
    }
  } else if (httpResponseCode == 404 || httpResponseCode == 401) {
    String response = http.getString();
    Serial.println("[Session] Session expired or not found");
    Serial.println("[Session] Response: " + response);
    current_user_id = "";
    current_user_name = "";
  } else if (httpResponseCode < 0) {
    Serial.println("[API] HTTP Error: " + http.errorToString(httpResponseCode));
  } else {
    String response = http.getString();
    Serial.println("[API] Unexpected response: " + response);
  }
  
  http.end();
  return false;
}

// --- FUNGSI REGISTER IP KE SERVER (BARU!) ---
bool registerDeviceIp() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Register] WiFi not connected");
    return false;
  }

  HTTPClient http;
  String endpoint = "https://smart-bottle-waste-bank.vercel.app/api/iot/register-device";
  
  Serial.println("[Register] Registering device IP to server...");
  
  http.begin(endpoint);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000);
  
  String jsonPayload = "{";
  jsonPayload += "\"device_id\":\"" + String(device_id) + "\",";
  jsonPayload += "\"ip_address\":\"" + WiFi.localIP().toString() + "\"";
  jsonPayload += "}";
  
  Serial.println("[Register] Payload: " + jsonPayload);
  
  int httpResponseCode = http.POST(jsonPayload);
  
  if (httpResponseCode == 200) {
    Serial.println("[Register] ✅ Device IP registered successfully!");
    String response = http.getString();
    Serial.println("[Register] Response: " + response);
    http.end();
    return true;
  } else {
    Serial.printf("[Register] ❌ Failed! Code: %d\n", httpResponseCode);
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("[Register] Response: " + response);
    } else {
      Serial.println("[Register] Error: " + http.errorToString(httpResponseCode));
    }
    http.end();
    return false;
  }
}

// --- FUNGSI KIRIM DATA KE SUPABASE ---
void sendDataToSupabase(const String& userId, int addedPoints, const String& bottleSize) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String endpoint = String(supabase_url) + "/rest/v1/transactions";
    
    http.begin(endpoint);
    http.addHeader("apikey", supabase_key);
    http.addHeader("Authorization", "Bearer " + String(supabase_key));
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Prefer", "return=minimal");
    
    String jsonPayload = "{";
    jsonPayload += "\"user_id\":\"" + userId + "\",";
    jsonPayload += "\"device_id\":\"" + String(device_id) + "\",";
    jsonPayload += "\"points_earned\":" + String(addedPoints) + ",";
    jsonPayload += "\"bottle_size\":\"" + bottleSize + "\"";
    jsonPayload += "}";
    
    Serial.println("[Supabase] Mengirim data:");
    Serial.println(jsonPayload);
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.printf("[Supabase] ✅ Data Terkirim! Respon: %d\n", httpResponseCode);
      String response = http.getString();
      Serial.println("[Supabase] Response: " + response);
    } else {
      Serial.printf("[Supabase] ❌ Gagal! Error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    
    http.end();
  } else {
    Serial.println("[WiFi] ❌ Terputus, gagal mengirim data.");
  }
}

// --- FUNGSI LOGIKA SENSOR ---
int readUltrasonicRawCm(uint8_t trigPin, uint8_t echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);  // Tingkatkan dari 2 ke 5
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(15); // Tingkatkan dari 10 ke 15
  digitalWrite(trigPin, LOW);
  
  unsigned long duration = pulseIn(echoPin, HIGH, 50000); // Tingkatkan timeout dari 30000 ke 50000
  int cm = (duration == 0) ? -1 : (int)(duration * 0.034f / 2.0f);
  
  // Debug: Print raw readings (DISABLED)
  // if (cm == -1) {
  //   Serial.printf("[Sensor] TIMEOUT on pin TRIG=%d ECHO=%d\n", trigPin, echoPin);
  // }
  
  return cm;
}

int readUltrasonicStableCm(uint8_t trigPin, uint8_t echoPin) {
  int samples[SENSOR_SAMPLES];
  int count = 0;
  
  for (int i = 0; i < SENSOR_SAMPLES; i++) {
    int cm = readUltrasonicRawCm(trigPin, echoPin);
    if (cm >= SENSOR_MIN_VALID_CM && cm <= SENSOR_MAX_VALID_CM) 
      samples[count++] = cm;
    delay(15);  // Tingkatkan dari 8 ke 15
  }
  
  // Debug: Print sample count (DISABLED)
  // if (count == 0) {
  //   Serial.printf("[Sensor] NO VALID SAMPLES from TRIG=%d ECHO=%d\n", trigPin, echoPin);
  // }
  
  if (count == 0) return -1;
  
  // Simple sort for median
  for (int i = 0; i < count - 1; i++) {
    for (int j = i + 1; j < count; j++) {
      if (samples[j] < samples[i]) { 
        int tmp = samples[i]; 
        samples[i] = samples[j]; 
        samples[j] = tmp; 
      }
    }
  }
  
  return samples[count / 2];
}

void openGate() { myservo.write(SERVO_OPEN_ANGLE); }
void closeGate() { myservo.write(SERVO_CLOSE_ANGLE); }

void buzzShort(int count) {
  for (int i = 0; i < count; i++) {
    digitalWrite(PIN_BUZZER, HIGH); 
    delay(90);
    digitalWrite(PIN_BUZZER, LOW); 
    delay(90);
  }
}

// Variabel untuk mencegah LCD berkedip
String lastLcdLine0 = "";
String lastLcdLine1 = "";

void lcdPrintLine(uint8_t line, const String &text) {
  if (!lcdConnected) return;
  
  // Cek apakah text berubah (mencegah update berulang)
  if (line == 0 && text == lastLcdLine0) return;
  if (line == 1 && text == lastLcdLine1) return;
  
  // Update LCD
  lcd->setCursor(0, line);
  for (int i = 0; i < 16; i++) lcd->print(' ');
  lcd->setCursor(0, line);
  lcd->print(text.substring(0, 16));
  
  // Simpan text terakhir
  if (line == 0) lastLcdLine0 = text;
  if (line == 1) lastLcdLine1 = text;
}

// ============================================
// HTTP SERVER HANDLERS (BARU!)
// ============================================

// Handler untuk terima token dari QR code scan
void handleSetToken() {
  // Log request details
  Serial.println("[HTTP] ========================================");
  Serial.println("[HTTP] Request received!");
  Serial.println("[HTTP] URI: " + server.uri());
  Serial.println("[HTTP] Method: " + String((server.method() == HTTP_GET) ? "GET" : (server.method() == HTTP_POST) ? "POST" : "OPTIONS"));
  Serial.println("[HTTP] Args: " + String(server.args()));
  
  for (uint8_t i = 0; i < server.args(); i++) {
    Serial.println("[HTTP]   " + server.argName(i) + ": " + server.arg(i));
  }
  Serial.println("[HTTP] ========================================");
  
  // Enable CORS untuk akses dari browser
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (server.method() == HTTP_OPTIONS) {
    server.send(200);
    return;
  }
  
  if (server.hasArg("token")) {
    String token = server.arg("token");
    
    Serial.println("[HTTP] Token received from QR scan!");
    Serial.println("[HTTP] Token: " + token);
    
    // Set session token
    session_token = token;
    
    // Verify token immediately
    if (getUserFromSession()) {
      // Success!
      server.send(200, "text/html", 
        "<html><body style='font-family:Arial;text-align:center;padding:50px;'>"
        "<h1 style='color:green;'>✅ Login Berhasil!</h1>"
        "<p>Akun Anda telah terhubung dengan device IoT.</p>"
        "<p><strong>Nama:</strong> " + current_user_name + "</p>"
        "<p>Silakan masukkan botol untuk memulai transaksi.</p>"
        "<p style='color:gray;font-size:12px;margin-top:30px;'>Anda bisa menutup halaman ini.</p>"
        "</body></html>"
      );
      
      // Update LCD
      gateState = WAIT_BOTTLE;
      lcdPrintLine(0, "HELLO!");
      lcdPrintLine(1, current_user_name.substring(0, 16));
      buzzShort(2);
      delay(2000);
    } else {
      // Failed
      server.send(401, "text/html",
        "<html><body style='font-family:Arial;text-align:center;padding:50px;'>"
        "<h1 style='color:red;'>❌ Login Gagal</h1>"
        "<p>Token tidak valid atau sudah expired.</p>"
        "<p>Silakan scan QR code lagi.</p>"
        "</body></html>"
      );
    }
  } else {
    server.send(400, "text/html",
      "<html><body style='font-family:Arial;text-align:center;padding:50px;'>"
      "<h1 style='color:orange;'>⚠️ Token Required</h1>"
      "<p>Parameter token tidak ditemukan.</p>"
      "</body></html>"
    );
  }
}

// Handler untuk root path
void handleRoot() {
  server.send(200, "text/html",
    "<html><body style='font-family:Arial;text-align:center;padding:50px;'>"
    "<h1>🤖 IoT Bank Sampah</h1>"
    "<p>Device: ESP32-BOTOL-01</p>"
    "<p>Status: " + String(WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected") + "</p>"
    "<p>IP: " + WiFi.localIP().toString() + "</p>"
    "<hr>"
    "<p style='color:gray;font-size:12px;'>Scan QR code dari web app untuk login</p>"
    "</body></html>"
  );
}

// Handler untuk request yang tidak ditemukan
void handleNotFound() {
  String message = "404 Not Found\n\n";
  message += "URI: " + server.uri() + "\n";
  message += "Method: " + String((server.method() == HTTP_GET) ? "GET" : "POST") + "\n";
  message += "Arguments: " + String(server.args()) + "\n";
  
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  
  Serial.println("[HTTP] 404 Not Found:");
  Serial.println(message);
  
  server.send(404, "text/plain", message);
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // ============================================
  // SETUP WIFI DENGAN DHCP (DYNAMIC IP)
  // ============================================
  Serial.println("\n🔧 Setting up WiFi with DHCP...");
  Serial.println("   (IP akan otomatis dari router)");
  
  // Connect to WiFi
  Serial.println("\n🔄 Connecting to WiFi...");
  Serial.print("   SSID: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  Serial.print("   Progress: ");
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500); 
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n\n✅ WiFi Connected!");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.print("📡 SSID:           ");
    Serial.println(WiFi.SSID());
    Serial.print("🌐 IP Address:     ");
    Serial.println(WiFi.localIP());
    Serial.print("🚪 Gateway:        ");
    Serial.println(WiFi.gatewayIP());
    Serial.print("🔢 Subnet:         ");
    Serial.println(WiFi.subnetMask());
    Serial.print("📶 Signal:         ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.println("\n⚠️  PENTING: Copy IP di atas dan update di web app!");
    Serial.println("   File: src/app/(user)/iot-auth/page.tsx");
    Serial.print("   Ganti esp32Ip = \"");
    Serial.print(WiFi.localIP());
    Serial.println("\"");
    Serial.println();
  } else {
    Serial.println("\n\n❌ WiFi Connection Failed!");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    Serial.println("💡 Troubleshooting:");
    Serial.println("   1. Check SSID & password benar");
    Serial.println("   2. Pastikan WiFi adalah 2.4GHz (bukan 5GHz)");
    Serial.println("   3. Restart ESP32 dan coba lagi");
    Serial.println("   4. Check router bisa assign IP (DHCP enabled)");
    Serial.println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Halt execution
    while (true) {
      delay(1000);
    }
  }
  
  pinMode(PIN_TRIG_HEIGHT, OUTPUT);
  pinMode(PIN_ECHO_HEIGHT, INPUT);       // ← Ubah dari INPUT_PULLDOWN ke INPUT
  pinMode(PIN_TRIG_LENGTH, OUTPUT);
  pinMode(PIN_ECHO_LENGTH, INPUT);       // ← Ubah dari INPUT_PULLDOWN ke INPUT
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_IR_LAMP, OUTPUT);
  pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);  // ← TAMBAHAN: Metal sensor
  
  // ============================================
  // SETUP LOAD CELL (BARU!)
  // ============================================
  Serial.println("[LoadCell] Initializing HX711...");
  scale.begin(PIN_LOADCELL_DOUT, PIN_LOADCELL_SCK);
  
  // Set kalibrasi load cell
  // ⚠️ PENTING: Nilai ini harus dikalibrasi sesuai load cell Anda!
  // Cara kalibrasi:
  // 1. Jalankan scale.read() tanpa beban → catat nilai (tare)
  // 2. Letakkan beban 100g → catat nilai
  // 3. Hitung: calibration_factor = (nilai_dengan_beban - tare) / 100
  scale.set_scale(420.0983);  // ← Ganti dengan nilai kalibrasi Anda
  scale.tare();               // Reset ke 0
  
  Serial.println("[LoadCell] ✅ HX711 Ready!");
  Serial.print("[LoadCell] Calibration factor: ");
  Serial.println(420.0983);
  
  // ============================================
  // SETUP LCD dengan DIAGNOSTIK (BARU!)
  // ============================================
  Serial.println("\n[LCD] Initializing I2C LCD...");
  Wire.begin(21, 22);  // SDA=21, SCL=22
  delay(100);
  
  // Scan I2C devices
  Serial.println("[LCD] Scanning I2C bus...");
  byte error, address;
  int nDevices = 0;
  uint8_t lcdAddress = 0;
  
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      Serial.print("[LCD] ✅ I2C device found at 0x");
      if (address < 16) Serial.print("0");
      Serial.println(address, HEX);
      
      // Simpan alamat LCD (biasanya 0x27 atau 0x3F)
      if (address == 0x27 || address == 0x3F) {
        lcdAddress = address;
      }
      nDevices++;
    }
  }
  
  if (nDevices == 0) {
    Serial.println("[LCD] ❌ No I2C devices found!");
    Serial.println("[LCD] Troubleshooting:");
    Serial.println("[LCD]   1. Check wiring: SDA=GPIO21, SCL=GPIO22");
    Serial.println("[LCD]   2. Check power: VCC=5V, GND=GND");
    Serial.println("[LCD]   3. Check I2C module on LCD backpack");
    Serial.println("[LCD]   4. Try adjusting potentiometer on LCD");
    lcdConnected = false;
  } else {
    Serial.printf("[LCD] Found %d I2C device(s)\n", nDevices);
    
    // Jika tidak ada alamat LCD standar, coba alamat pertama yang ditemukan
    if (lcdAddress == 0) {
      Serial.println("[LCD] ⚠️ No standard LCD address found, trying first device...");
      // Scan ulang untuk ambil alamat pertama
      for(address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        if (Wire.endTransmission() == 0) {
          lcdAddress = address;
          break;
        }
      }
    }
    
    if (lcdAddress > 0) {
      Serial.print("[LCD] Using address: 0x");
      Serial.println(lcdAddress, HEX);
      
      // Initialize LCD
      lcd = new LiquidCrystal_I2C(lcdAddress, 16, 2);
      lcd->init();
      lcd->backlight();
      lcd->noCursor();
      lcd->noBlink();
      delay(100);
      
      // Test LCD
      lcd->clear();
      lcd->setCursor(0, 0);
      lcd->print("LCD TEST OK!");
      lcd->setCursor(0, 1);
      lcd->print("Addr: 0x");
      lcd->print(lcdAddress, HEX);
      
      Serial.println("[LCD] ✅ LCD initialized successfully!");
      lcdConnected = true;
      delay(2000);
    } else {
      Serial.println("[LCD] ❌ Failed to find valid LCD address");
      lcdConnected = false;
    }
  }
  
  ESP32PWM::allocateTimer(0);
  myservo.setPeriodHertz(50);
  myservo.attach(PIN_SERVO, 500, 2400);
  closeGate();
  
  if (lcdConnected) {
    lcdPrintLine(0, "SYSTEM READY");
    lcdPrintLine(1, "WiFi OK");
  } else {
    Serial.println("[LCD] ⚠️ Running without LCD display");
  }
  buzzShort(1);
  
  Serial.println("\n=================================");
  Serial.println("IoT Bank Sampah Digital");
  Serial.println("=================================");
  
  if (USE_QR_LOGIN) {
    Serial.println("Mode: QR LOGIN");
    Serial.println("Commands:");
    Serial.println("  TOKEN:<token>  - Set session token");
    Serial.println("  CHECK          - Check current session");
    Serial.println("  CLEAR          - Clear session");
    Serial.println("  LOGOUT         - Logout and delete session");
    Serial.println("  LCD            - Test LCD display");
    Serial.println("  SCAN           - Scan I2C devices");
    Serial.println("  TEST           - Test sensors (Height, Length, Weight)");
    gateState = WAIT_USER;
  } else {
    Serial.println("Mode: DEFAULT USER");
    Serial.println("Default User ID: " + String(default_user_id));
    Serial.println("Commands:");
    Serial.println("  LCD            - Test LCD display");
    Serial.println("  SCAN           - Scan I2C devices");
    Serial.println("  TEST           - Test sensors (Height, Length, Weight)");
    gateState = WAIT_BOTTLE;
  }
  
  Serial.println("=================================\n");
  
  // ============================================
  // SETUP HTTP SERVER (BARU!)
  // ============================================
  server.on("/", handleRoot);
  server.on("/set-token", handleSetToken);
  server.onNotFound(handleNotFound);  // ← TAMBAHAN: Handle 404
  server.begin();
  
  Serial.println("[HTTP] Server started on port 80");
  Serial.print("[HTTP] Access at: http://");
  Serial.println(WiFi.localIP());
  Serial.println("[HTTP] Endpoints:");
  Serial.println("[HTTP]   GET  /              → Device info");
  Serial.println("[HTTP]   GET  /set-token     → Auto-login from QR");
  Serial.println("=================================\n");
  
  // ============================================
  // REGISTER IP KE SERVER (BARU!)
  // ============================================
  Serial.println("[Register] Registering device IP to cloud...");
  if (registerDeviceIp()) {
    Serial.println("[Register] ✅ Device is now discoverable!");
    Serial.println("[Register] Web app akan otomatis dapat IP ini");
  } else {
    Serial.println("[Register] ⚠️ Registration failed, retry in 30s...");
  }
  Serial.println("=================================\n");
  
  delay(2000);
}

void loop() {
  // ============================================
  // HANDLE HTTP REQUESTS (BARU!)
  // ============================================
  server.handleClient();
  
  // ============================================
  // PERIODIC IP REGISTRATION (BARU!)
  // ============================================
  // Re-register IP setiap 5 menit untuk keep-alive
  if (millis() - lastIpRegistration > IP_REGISTRATION_INTERVAL) {
    lastIpRegistration = millis();
    Serial.println("[Loop] Re-registering device IP...");
    registerDeviceIp();
  }
  
  // Handle serial commands
  if (USE_QR_LOGIN && Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command.startsWith("TOKEN:")) {
      session_token = command.substring(6);
      Serial.println("[Command] Token set: " + session_token);
      
      if (getUserFromSession()) {
        gateState = WAIT_BOTTLE;
        lcdPrintLine(0, "HELLO!");
        lcdPrintLine(1, current_user_name.substring(0, 16));
        buzzShort(2);
        delay(2000);
      } else {
        lcdPrintLine(0, "LOGIN FAILED");
        lcdPrintLine(1, "SCAN QR AGAIN");
      }
    } 
    else if (command == "CHECK") {
      Serial.println("[Command] Checking session...");
      getUserFromSession();
    } 
    else if (command == "CLEAR") {
      session_token = "";
      current_user_id = "";
      current_user_name = "";
      gateState = WAIT_USER;
      Serial.println("[Command] Session cleared");
      lcdPrintLine(0, "SESSION CLEARED");
      lcdPrintLine(1, "SCAN QR CODE");
    }
    else if (command == "LOGOUT") {
      deleteSession();
      Serial.println("[Command] Logged out");
      lcdPrintLine(0, "LOGGED OUT");
      lcdPrintLine(1, "SCAN QR AGAIN");
      buzzShort(2);
    }
    else if (command == "LCD") {
      // Test LCD
      Serial.println("[Command] Testing LCD...");
      if (lcdConnected) {
        lcd->clear();
        lcd->setCursor(0, 0);
        lcd->print("LCD TEST 1234");
        lcd->setCursor(0, 1);
        lcd->print("ABCDEFGHIJKLMNOP");
        Serial.println("[LCD] ✅ Test message sent");
      } else {
        Serial.println("[LCD] ❌ LCD not connected");
      }
    }
    else if (command == "SCAN") {
      // Scan I2C devices
      Serial.println("[Command] Scanning I2C bus...");
      byte error, address;
      int nDevices = 0;
      
      for(address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        error = Wire.endTransmission();
        
        if (error == 0) {
          Serial.print("[I2C] Device found at 0x");
          if (address < 16) Serial.print("0");
          Serial.println(address, HEX);
          nDevices++;
        }
      }
      
      if (nDevices == 0) {
        Serial.println("[I2C] No devices found");
      } else {
        Serial.printf("[I2C] Found %d device(s)\n", nDevices);
      }
    }
    else if (command == "TEST") {
      // Test all sensors
      Serial.println("[Command] Testing sensors...");
      Serial.println("=================================");
      
      // Test HEIGHT sensor
      Serial.println("[Test] Reading HEIGHT sensor (5 samples)...");
      for (int i = 0; i < 5; i++) {
        int h = readUltrasonicRawCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
        Serial.printf("  Sample %d: %d cm\n", i+1, h);
        delay(100);
      }
      int heightStable = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
      Serial.printf("[Test] HEIGHT (stable): %d cm\n\n", heightStable);
      
      // Test LENGTH sensor
      Serial.println("[Test] Reading LENGTH sensor (5 samples)...");
      for (int i = 0; i < 5; i++) {
        int l = readUltrasonicRawCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
        Serial.printf("  Sample %d: %d cm\n", i+1, l);
        delay(100);
      }
      int lengthStable = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
      Serial.printf("[Test] LENGTH (stable): %d cm\n\n", lengthStable);
      
      // Test WEIGHT sensor
      Serial.println("[Test] Reading WEIGHT sensor...");
      float w = readWeight();
      Serial.printf("[Test] WEIGHT: %.2f g\n\n", w);
      
      // Test METAL sensor
      Serial.println("[Test] Reading METAL sensor...");
      bool metal = readMetalSensor();
      Serial.printf("[Test] METAL: %s\n\n", metal ? "DETECTED" : "NOT DETECTED");
      
      Serial.println("=================================");
      Serial.println("[Test] Summary:");
      Serial.printf("  Height: %d cm\n", heightStable);
      Serial.printf("  Length: %d cm\n", lengthStable);
      Serial.printf("  Weight: %.2f g\n", w);
      Serial.printf("  Metal: %s\n", metal ? "YES" : "NO");
      Serial.println("=================================");
      
      // Display on LCD
      if (lcdConnected) {
        lcd->clear();
        lcd->setCursor(0, 0);
        lcd->print("H:" + String(heightStable) + " L:" + String(lengthStable));
        lcd->setCursor(0, 1);
        lcd->print("W:" + String(w, 1) + "g M:" + String(metal ? "Y" : "N"));
      }
    }
  }
  
  // Periodic session check
  if (USE_QR_LOGIN && millis() - lastSessionCheck > SESSION_CHECK_INTERVAL && current_user_id.length() > 0) {
    lastSessionCheck = millis();
    if (!getUserFromSession()) {
      Serial.println("[Session] Session expired");
      gateState = WAIT_USER;
      current_user_id = "";
      current_user_name = "";
      lcdPrintLine(0, "SESSION EXPIRED");
      lcdPrintLine(1, "SCAN QR AGAIN");
      buzzShort(3);
      delay(2000);
    }
  }
  
  // Read sensors
  if (millis() - lastSensorReadAt > 120) {
    heightCm = readUltrasonicStableCm(PIN_TRIG_HEIGHT, PIN_ECHO_HEIGHT);
    delay(100);  // Tingkatkan delay untuk menghindari interferensi
    lengthCm = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
    delay(100);  // Tingkatkan delay
    // weightGram = readWeight();           // ← DISABLED: Berat dinonaktifkan untuk sementara
    isMetalDetected = readMetalSensor(); // ← TAMBAHAN: Cek metal
    lastSensorReadAt = millis();
  }
  
  bool bottlePresent = (heightCm > 0 && heightCm <= OBJECT_PRESENT_CM) || 
                       (lengthCm > 0 && lengthCm <= OBJECT_PRESENT_CM);
  bool bottleGone = ((heightCm < 0 || heightCm >= OBJECT_GONE_CM) && 
                     (lengthCm < 0 || lengthCm >= OBJECT_GONE_CM));
  
  // Debug: Print sensor readings (DISABLED - focus transaksi saja)
  // if (bottlePresent) {
  //   Serial.printf("[Sensor] Height: %dcm, Length: %dcm\n", heightCm, lengthCm);
  // }
  
  // State machine (dengan static state untuk mencegah update berulang)
  static GateState lastDisplayedState = REJECT_HOLD; // Init dengan state yang tidak mungkin
  static String lastDisplayedUser = "";
  
  if (gateState == WAIT_USER) {
    if (lastDisplayedState != WAIT_USER) {
      lcdPrintLine(0, "SCAN QR CODE");
      lcdPrintLine(1, "TO LOGIN");
      lastDisplayedState = WAIT_USER;
    }
  }
  else if (gateState == WAIT_BOTTLE) {
    if (USE_QR_LOGIN && current_user_name.length() > 0) {
      if (lastDisplayedState != WAIT_BOTTLE || lastDisplayedUser != current_user_name) {
        lcdPrintLine(0, current_user_name.substring(0, 16));
        lcdPrintLine(1, "MASUKKAN BOTOL");
        lastDisplayedState = WAIT_BOTTLE;
        lastDisplayedUser = current_user_name;
      }
    } else {
      if (lastDisplayedState != WAIT_BOTTLE) {
        lcdPrintLine(0, "SIAP MASUKKAN");
        lcdPrintLine(1, "");
        lastDisplayedState = WAIT_BOTTLE;
      }
    }
    
    if (bottlePresent && (millis() - lastDecisionAt > DECISION_COOLDOWN_MS)) {
      // CEK LOGAM TERLEBIH DAHULU
      if (isMetalDetected) {
        closeGate();
        buzzShort(3);  // 3x buzz = warning
        lcdPrintLine(0, "BOTOL CACAT");
        lcdPrintLine(1, "ADA LOGAM");
        lastDisplayedState = REJECT_HOLD;
        
        Serial.println("[Metal] ⚠️ LOGAM TERDETEKSI - REJECT");
        
        gateState = REJECT_HOLD;
        stateStartedAt = millis();
      } else {
        // Klasifikasi ukuran botol
        currentBottleSize = classifyBottle(heightCm, lengthCm, weightGram);
        currentBottlePoints = getBottlePoints(currentBottleSize);
        
        if (currentBottleSize != NONE) {
          openGate();
          buzzShort(1);
          
          String sizeName = String(getBottleSizeName(currentBottleSize));
          lcdPrintLine(0, "BOTOL " + sizeName);
          lcdPrintLine(1, "+" + String(currentBottlePoints) + " POIN");
          lastDisplayedState = WAIT_PASS; // Update state
          
          Serial.println("[Bottle] Size: " + sizeName);
          Serial.println("[Bottle] Height: " + String(heightCm) + "cm, Length: " + String(lengthCm) + "cm");
          Serial.println("[Bottle] Points: " + String(currentBottlePoints));
          
          gateState = WAIT_PASS;
          stateStartedAt = millis();
        } else {
          closeGate();
          buzzShort(2);
          lcdPrintLine(0, "UKURAN SALAH");
          lcdPrintLine(1, "H:" + String(heightCm) + " L:" + String(lengthCm));
          lastDisplayedState = REJECT_HOLD; // Update state
          
          Serial.println("[Bottle] REJECTED - Height: " + String(heightCm) + "cm, Length: " + String(lengthCm) + "cm");
          
          gateState = REJECT_HOLD;
          stateStartedAt = millis();
        }
      }
      lastDecisionAt = millis();
    }
  } 
  else if (gateState == WAIT_PASS) {
    if (bottleGone && (millis() - stateStartedAt > 1000)) {
      points += currentBottlePoints;
      closeGate();
      
      String sizeName = String(getBottleSizeName(currentBottleSize));
      lcdPrintLine(0, "+" + String(currentBottlePoints) + " POIN");
      lcdPrintLine(1, "SENDING...");
      
      // Kirim ke Supabase
      String userId;
      if (USE_QR_LOGIN && current_user_id.length() > 0) {
        userId = current_user_id;
      } else {
        userId = String(default_user_id);
      }
      
      sendDataToSupabase(userId, currentBottlePoints, sizeName);
      
      delay(1500);
      lcdPrintLine(0, "SUCCESS!");
      lcdPrintLine(1, sizeName + " " + String(currentBottlePoints) + "PT");
      delay(1000);
      
      // Auto-logout setelah transaksi (untuk keamanan)
      if (USE_QR_LOGIN && current_user_id.length() > 0) {
        lcdPrintLine(1, "LOGGING OUT...");
        delay(1000);
        deleteSession();
        lcdPrintLine(0, "THANK YOU!");
        lcdPrintLine(1, current_user_name.substring(0, 16));
        delay(2000);
      } else {
        delay(1000);
      }
      
      // Reset bottle size
      currentBottleSize = NONE;
      currentBottlePoints = 0;
      lastDisplayedState = REJECT_HOLD; // Force update LCD
      
      gateState = USE_QR_LOGIN ? WAIT_USER : WAIT_BOTTLE;
    } 
    else if (millis() - stateStartedAt > OPEN_TIMEOUT_MS) {
      closeGate();
      lcdPrintLine(0, "TIMEOUT");
      lcdPrintLine(1, "COBA LAGI");
      
      // Reset bottle size
      currentBottleSize = NONE;
      currentBottlePoints = 0;
      
      delay(1000);
      lastDisplayedState = REJECT_HOLD; // Force update LCD
      gateState = WAIT_BOTTLE;
    }
  } 
  else if (gateState == REJECT_HOLD) {
    if (millis() - stateStartedAt > REJECT_HOLD_MS) {
      lastDisplayedState = REJECT_HOLD; // Force update LCD
      gateState = WAIT_BOTTLE;
    }
  }
  
  delay(50);
}
