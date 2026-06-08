#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WebServer.h>  // ← TAMBAHAN: Untuk HTTP server

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
const char* api_get_user = "http://192.168.1.7:3000/api/iot/get-user";

// Session variables
String session_token = "";
String current_user_id = "";
String current_user_name = "";
unsigned long lastSessionCheck = 0;
#define SESSION_CHECK_INTERVAL 10000 // Check every 10 seconds (lebih responsif)

// --- KONFIGURASI PIN ---
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 15
#define PIN_SERVO 19
#define PIN_BUZZER 23
#define PIN_IR_LAMP 13
#define PIN_METAL_SENSOR 14  // ← BARU: Pin untuk sensor logam (Inductive Proximity Sensor)

// --- KONFIGURASI SERVO ---
#define SERVO_OPEN_ANGLE 90
#define SERVO_CLOSE_ANGLE 0

// --- KLASIFIKASI UKURAN BOTOL (cm) ---
// ⚠️ PENTING: Botol diletakkan HORIZONTAL (tidur)
// - Sensor HEIGHT mengukur DIAMETER botol
// - Sensor LENGTH mengukur PANJANG botol

// Botol KECIL (contoh: botol air mineral 330ml)
// Panjang: 15-20cm, Diameter: 5-7cm
#define SMALL_HEIGHT_MIN 5      // Diameter min (sensor HEIGHT)
#define SMALL_HEIGHT_MAX 11     // Diameter max
#define SMALL_LENGTH_MIN 10     // Panjang min (sensor LENGTH)
#define SMALL_LENGTH_MAX 14     // Panjang max
#define SMALL_POINTS 5

// Botol SEDANG (contoh: botol air mineral 600ml)
// Panjang: 20-25cm, Diameter: 6-8cm
#define MEDIUM_HEIGHT_MIN 12     // Diameter min (sensor HEIGHT)
#define MEDIUM_HEIGHT_MAX 17     // Diameter max
#define MEDIUM_LENGTH_MIN 15    // Panjang min (sensor LENGTH)
#define MEDIUM_LENGTH_MAX 22    // Panjang max
#define MEDIUM_POINTS 10

// Botol BESAR (contoh: botol air mineral 1.5L)
// Panjang: 25-35cm, Diameter: 8-11cm
#define LARGE_HEIGHT_MIN 18      // Diameter min (sensor HEIGHT)
#define LARGE_HEIGHT_MAX 22     // Diameter max
#define LARGE_LENGTH_MIN 23     // Panjang min (sensor LENGTH)
#define LARGE_LENGTH_MAX 30     // Panjang max
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

enum GateState { WAIT_USER, WAIT_BOTTLE, WAIT_PASS, REJECT_HOLD };
GateState gateState = WAIT_BOTTLE;

enum BottleSize { NONE, SMALL, MEDIUM, LARGE };

int points = 0;
int heightCm = -1;
int lengthCm = -1;
BottleSize currentBottleSize = NONE;
int currentBottlePoints = 0;
unsigned long stateStartedAt = 0;
unsigned long lastDecisionAt = 0;
unsigned long lampOnUntil = 0;
unsigned long lastSensorReadAt = 0;

// --- FUNGSI KLASIFIKASI UKURAN BOTOL (BARU!) ---
BottleSize classifyBottle(int height, int length) {
  // Validasi input
  if (height < HEIGHT_MIN_CM || height > HEIGHT_MAX_CM || 
      length < LENGTH_MIN_CM || length > LENGTH_MAX_CM) {
    return NONE;
  }
  
  // Klasifikasi berdasarkan tinggi dan diameter
  // Prioritas: Cek tinggi dulu, lalu diameter untuk konfirmasi
  
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

String getBottleSizeName(BottleSize size) {
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
  http.begin(url);
  http.setTimeout(5000);
  
  int httpResponseCode = http.GET();
  
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
    }
  } else if (httpResponseCode == 404 || httpResponseCode == 401) {
    Serial.println("[Session] Session expired or not found");
    current_user_id = "";
    current_user_name = "";
  }
  
  http.end();
  return false;
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
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  unsigned long duration = pulseIn(echoPin, HIGH, 30000);
  return (duration == 0) ? -1 : (int)(duration * 0.034f / 2.0f);
}

int readUltrasonicStableCm(uint8_t trigPin, uint8_t echoPin) {
  int samples[SENSOR_SAMPLES];
  int count = 0;
  
  for (int i = 0; i < SENSOR_SAMPLES; i++) {
    int cm = readUltrasonicRawCm(trigPin, echoPin);
    if (cm >= SENSOR_MIN_VALID_CM && cm <= SENSOR_MAX_VALID_CM) 
      samples[count++] = cm;
    delay(8);
  }
  
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

void lcdPrintLine(uint8_t line, const String &text) {
  if (!lcdConnected) return;
  lcd->setCursor(0, line);
  for (int i = 0; i < 16; i++) lcd->print(' ');
  lcd->setCursor(0, line);
  lcd->print(text.substring(0, 16));
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
  
  // Setup WiFi dengan Static IP (agar IP tidak berubah)
  IPAddress local_IP(192, 168, 100, 87);      // ← IP ESP32 (sesuaikan)
  IPAddress gateway(192, 168, 100, 1);        // ← Gateway router
  IPAddress subnet(255, 255, 255, 0);         // ← Subnet mask
  IPAddress primaryDNS(8, 8, 8, 8);           // ← Google DNS (optional)
  IPAddress secondaryDNS(8, 8, 4, 4);         // ← Google DNS (optional)
  
  // Configure static IP
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("⚠️ Static IP configuration failed!");
  }
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); 
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("⚠️ PENTING: IP ini harus sama dengan esp32Ip di web app!");
  
  pinMode(PIN_TRIG_HEIGHT, OUTPUT);
  pinMode(PIN_ECHO_HEIGHT, INPUT_PULLDOWN);
  pinMode(PIN_TRIG_LENGTH, OUTPUT);
  pinMode(PIN_ECHO_LENGTH, INPUT_PULLDOWN);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_IR_LAMP, OUTPUT);
  pinMode(PIN_METAL_SENSOR, INPUT_PULLUP);  // ← BARU: Setup sensor logam (active LOW)
  
  Wire.begin(21, 22);
  
  // Detect LCD Address
  uint8_t addr = 0x27;
  Wire.beginTransmission(addr);
  if (Wire.endTransmission() != 0) addr = 0x3F;
  
  lcd = new LiquidCrystal_I2C(addr, 16, 2);
  lcd->init(); 
  lcd->backlight(); 
  lcdConnected = true;
  
  ESP32PWM::allocateTimer(0);
  myservo.setPeriodHertz(50);
  myservo.attach(PIN_SERVO, 500, 2400);
  closeGate();
  
  lcdPrintLine(0, "SYSTEM READY");
  lcdPrintLine(1, "WiFi OK");
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
    gateState = WAIT_USER;
  } else {
    Serial.println("Mode: DEFAULT USER");
    Serial.println("Default User ID: " + String(default_user_id));
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
  
  delay(2000);
}

void loop() {
  // ============================================
  // HANDLE HTTP REQUESTS (BARU!)
  // ============================================
  server.handleClient();
  
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
    delay(SENSOR_INTER_DELAY_MS);
    lengthCm = readUltrasonicStableCm(PIN_TRIG_LENGTH, PIN_ECHO_LENGTH);
    lastSensorReadAt = millis();
  }
  
  // ============================================
  // CEK SENSOR LOGAM (BARU!)
  // ============================================
  // Sensor logam: LOW = Logam terdeteksi, HIGH = Tidak ada logam
  bool metalDetected = (digitalRead(PIN_METAL_SENSOR) == LOW);
  
  bool bottlePresent = (heightCm > 0 && heightCm <= OBJECT_PRESENT_CM) || 
                       (lengthCm > 0 && lengthCm <= OBJECT_PRESENT_CM);
  bool bottleGone = ((heightCm < 0 || heightCm >= OBJECT_GONE_CM) && 
                     (lengthCm < 0 || lengthCm >= OBJECT_GONE_CM));
  
  // State machine
  if (gateState == WAIT_USER) {
    lcdPrintLine(0, "SCAN QR CODE");
    lcdPrintLine(1, "TO LOGIN");
  }
  else if (gateState == WAIT_BOTTLE) {
    if (USE_QR_LOGIN && current_user_name.length() > 0) {
      lcdPrintLine(0, current_user_name.substring(0, 16));
      lcdPrintLine(1, "MASUKKAN BOTOL");
    } else {
      lcdPrintLine(0, "SIAP MASUKKAN");
      lcdPrintLine(1, "");
    }
    
    if (bottlePresent && (millis() - lastDecisionAt > DECISION_COOLDOWN_MS)) {
      // ============================================
      // CEK LOGAM DULU! (BARU!)
      // ============================================
      if (metalDetected) {
        // TOLAK! Botol logam/kaleng terdeteksi
        closeGate();
        buzzShort(3);  // 3x beep = logam terdeteksi
        lcdPrintLine(0, "DITOLAK!");
        lcdPrintLine(1, "BOTOL LOGAM");
        
        Serial.println("[Metal] ❌ REJECTED - Metal bottle detected!");
        Serial.println("[Metal] Only PLASTIC bottles accepted");
        
        gateState = REJECT_HOLD;
        stateStartedAt = millis();
        lastDecisionAt = millis();
      } else {
        // OK! Bukan logam, lanjut klasifikasi ukuran
        currentBottleSize = classifyBottle(heightCm, lengthCm);
        currentBottlePoints = getBottlePoints(currentBottleSize);
        
        if (currentBottleSize != NONE) {
          openGate();
          buzzShort(1);
          
          String sizeName = getBottleSizeName(currentBottleSize);
          lcdPrintLine(0, "BOTOL " + sizeName);
          lcdPrintLine(1, "+" + String(currentBottlePoints) + " POIN");
          
          Serial.println("[Bottle] ✅ PLASTIC bottle detected");
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
          
          Serial.println("[Bottle] REJECTED - Height: " + String(heightCm) + "cm, Length: " + String(lengthCm) + "cm");
          
          gateState = REJECT_HOLD;
          stateStartedAt = millis();
        }
        lastDecisionAt = millis();
      }
    }
  } 
  else if (gateState == WAIT_PASS) {
    if (bottleGone && (millis() - stateStartedAt > 1000)) {
      points += currentBottlePoints;
      closeGate();
      
      String sizeName = getBottleSizeName(currentBottleSize);
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
      gateState = WAIT_BOTTLE;
    }
  } 
  else if (gateState == REJECT_HOLD) {
    if (millis() - stateStartedAt > REJECT_HOLD_MS) {
      gateState = WAIT_BOTTLE;
    }
  }
  
  delay(50);
}
