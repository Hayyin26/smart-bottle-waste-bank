#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- KONFIGURASI WIFI & SUPABASE ---
const char* ssid = "Kost Premium";
const char* password = "kostbusripit";
const char* supabase_url = "https://dsdtxqpzofrvzxpyktoo.supabase.co";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk";
const char* device_id = "ESP32-BOTOL-01";

// API endpoint untuk get user dari session
const char* api_get_user = "http://YOUR_DOMAIN/api/iot/get-user"; // Ganti dengan domain Anda

// Session token dari QR code (akan diupdate via Serial atau hardcode)
String session_token = ""; // Akan diisi dari QR code
String current_user_id = "";
String current_user_name = "";

// --- KONFIGURASI PIN ---
#define PIN_TRIG_HEIGHT 4
#define PIN_ECHO_HEIGHT 18
#define PIN_TRIG_LENGTH 5
#define PIN_ECHO_LENGTH 15
#define PIN_SERVO 19
#define PIN_BUZZER 23
#define PIN_IR_LAMP 13

// --- KONFIGURASI SERVO ---
#define SERVO_OPEN_ANGLE 90
#define SERVO_CLOSE_ANGLE 0

// --- RENTANG UKURAN BOTOL (cm) ---
#define HEIGHT_MIN_CM 8
#define HEIGHT_MAX_CM 25
#define LENGTH_MIN_CM 3
#define LENGTH_MAX_CM 12

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

// --- SESSION TIMEOUT ---
#define SESSION_CHECK_INTERVAL 30000 // Check session every 30 seconds
unsigned long lastSessionCheck = 0;

LiquidCrystal_I2C *lcd = nullptr;
bool lcdConnected = false;
Servo myservo;

enum GateState { WAIT_USER, WAIT_BOTTLE, WAIT_PASS, REJECT_HOLD };
GateState gateState = WAIT_USER;

int points = 0;
int heightCm = -1;
int lengthCm = -1;
unsigned long stateStartedAt = 0;
unsigned long lastDecisionAt = 0;
unsigned long lampOnUntil = 0;
unsigned long lastSensorReadAt = 0;

// --- FUNGSI GET USER ID DARI SESSION TOKEN ---
bool getUserFromSession() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Not connected");
    return false;
  }

  if (session_token.length() == 0) {
    Serial.println("[Session] No token available");
    return false;
  }

  HTTPClient http;
  String url = String(api_get_user) + "?token=" + session_token + "&device=" + device_id;
  
  Serial.println("[API] Getting user from session...");
  Serial.println("[API] URL: " + url);
  
  http.begin(url);
  http.setTimeout(5000);
  
  int httpResponseCode = http.GET();
  
  if (httpResponseCode == 200) {
    String response = http.getString();
    Serial.println("[API] Response: " + response);
    
    // Parse JSON response
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, response);
    
    if (error) {
      Serial.print("[JSON] Parse error: ");
      Serial.println(error.c_str());
      http.end();
      return false;
    }
    
    current_user_id = doc["user_id"].as<String>();
    current_user_name = doc["full_name"].as<String>();
    
    Serial.println("[Session] ✅ User found!");
    Serial.println("[Session] User ID: " + current_user_id);
    Serial.println("[Session] Name: " + current_user_name);
    
    http.end();
    return true;
  } else {
    Serial.printf("[API] ❌ Error: %d\n", httpResponseCode);
    if (httpResponseCode == 404 || httpResponseCode == 401) {
      Serial.println("[Session] Session expired or not found");
      current_user_id = "";
      current_user_name = "";
    }
    http.end();
    return false;
  }
}

// --- FUNGSI KIRIM DATA KE SUPABASE ---
void sendDataToSupabase(const String& userId, int addedPoints) {
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
    jsonPayload += "\"points_earned\":" + String(addedPoints);
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

void setup() {
  Serial.begin(115200);
  
  // Setup WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); 
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  pinMode(PIN_TRIG_HEIGHT, OUTPUT);
  pinMode(PIN_ECHO_HEIGHT, INPUT_PULLDOWN);
  pinMode(PIN_TRIG_LENGTH, OUTPUT);
  pinMode(PIN_ECHO_LENGTH, INPUT_PULLDOWN);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_IR_LAMP, OUTPUT);
  
  Wire.begin(21, 22);
  
  // Detect LCD Address 0x27 or 0x3F
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
  Serial.println("IoT Bank Sampah - QR Login System");
  Serial.println("=================================");
  Serial.println("Commands:");
  Serial.println("  TOKEN:<token>  - Set session token");
  Serial.println("  CHECK          - Check current session");
  Serial.println("  CLEAR          - Clear session");
  Serial.println("=================================\n");
  
  delay(2000);
  
  lcdPrintLine(0, "SCAN QR CODE");
  lcdPrintLine(1, "TO LOGIN");
}

void loop() {
  // Check for serial commands (untuk set token dari QR scanner atau manual)
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    
    if (command.startsWith("TOKEN:")) {
      session_token = command.substring(6);
      Serial.println("[Command] Token set: " + session_token);
      
      // Try to get user immediately
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
    } else if (command == "CHECK") {
      Serial.println("[Command] Checking session...");
      getUserFromSession();
    } else if (command == "CLEAR") {
      session_token = "";
      current_user_id = "";
      current_user_name = "";
      gateState = WAIT_USER;
      Serial.println("[Command] Session cleared");
      lcdPrintLine(0, "SESSION CLEARED");
      lcdPrintLine(1, "SCAN QR CODE");
    }
  }
  
  // Periodic session check
  if (millis() - lastSessionCheck > SESSION_CHECK_INTERVAL && current_user_id.length() > 0) {
    lastSessionCheck = millis();
    if (!getUserFromSession()) {
      // Session expired
      Serial.println("[Session] Session expired, returning to WAIT_USER");
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
  
  bool bottlePresent = (heightCm > 0 && heightCm <= OBJECT_PRESENT_CM) || 
                       (lengthCm > 0 && lengthCm <= OBJECT_PRESENT_CM);
  bool bottleGone = ((heightCm < 0 || heightCm >= OBJECT_GONE_CM) && 
                     (lengthCm < 0 || lengthCm >= OBJECT_GONE_CM));
  
  // State machine
  if (gateState == WAIT_USER) {
    lcdPrintLine(0, "SCAN QR CODE");
    lcdPrintLine(1, "TO LOGIN");
    // Waiting for user to scan QR and send token via Serial
  }
  else if (gateState == WAIT_BOTTLE) {
    lcdPrintLine(0, current_user_name.substring(0, 16));
    lcdPrintLine(1, "MASUKKAN BOTOL");
    
    if (bottlePresent && (millis() - lastDecisionAt > DECISION_COOLDOWN_MS)) {
      if (heightCm >= HEIGHT_MIN_CM && heightCm <= HEIGHT_MAX_CM && 
          lengthCm >= LENGTH_MIN_CM && lengthCm <= LENGTH_MAX_CM) {
        openGate();
        buzzShort(1);
        lcdPrintLine(0, "BOTOL VALID");
        lcdPrintLine(1, "MASUKKAN...");
        gateState = WAIT_PASS;
        stateStartedAt = millis();
      } else {
        closeGate();
        buzzShort(2);
        lcdPrintLine(0, "UKURAN SALAH");
        lcdPrintLine(1, "COBA LAGI");
        gateState = REJECT_HOLD;
        stateStartedAt = millis();
      }
      lastDecisionAt = millis();
    }
  } 
  else if (gateState == WAIT_PASS) {
    if (bottleGone && (millis() - stateStartedAt > 1000)) {
      points += 10;
      closeGate();
      lcdPrintLine(0, "+10 POINT");
      lcdPrintLine(1, "SENDING...");
      
      // Send to Supabase with current user ID
      sendDataToSupabase(current_user_id, 10);
      
      delay(1500);
      lcdPrintLine(0, "SUCCESS!");
      lcdPrintLine(1, current_user_name.substring(0, 16));
      delay(1000);
      
      gateState = WAIT_BOTTLE;
    } 
    else if (millis() - stateStartedAt > OPEN_TIMEOUT_MS) {
      closeGate();
      lcdPrintLine(0, "TIMEOUT");
      lcdPrintLine(1, "COBA LAGI");
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
