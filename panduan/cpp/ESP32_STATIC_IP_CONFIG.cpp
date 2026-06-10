/**
 * ESP32 Static IP Configuration
 * Copy-paste konfigurasi ini ke main.cpp atau ESP32_UPDATED_CODE.ino
 * 
 * Network: 192.168.1.x
 * Gateway: 192.168.1.1
 * Laptop IP: 192.168.1.7
 */

// ========================================
// STATIC IP CONFIGURATION
// ========================================

// Set static IP untuk ESP32
IPAddress local_IP(192, 168, 1, 200);      // IP ESP32 (pilih IP yang tidak terpakai)
IPAddress gateway(192, 168, 1, 1);          // Gateway WiFi router
IPAddress subnet(255, 255, 255, 0);         // Subnet mask
IPAddress primaryDNS(8, 8, 8, 8);          // Google DNS
IPAddress secondaryDNS(8, 8, 4, 4);        // Google DNS secondary

// ========================================
// PASTE DI setup() SEBELUM WiFi.begin()
// ========================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  // ===== WIFI SETUP =====
  Serial.println("\n🔧 Setting up WiFi...");

  // Configure static IP BEFORE WiFi.begin()
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("❌ Static IP configuration failed!");
  } else {
    Serial.println("✅ Static IP configured");
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  
  Serial.print("🔄 Connecting to WiFi");
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.print("📡 SSID: ");
    Serial.println(WiFi.SSID());
    Serial.print("🌐 IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("🚪 Gateway: ");
    Serial.println(WiFi.gatewayIP());
    Serial.print("📶 Signal Strength: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
    Serial.println("💡 Tips:");
    Serial.println("   - Check SSID & password");
    Serial.println("   - Make sure WiFi is 2.4GHz (not 5GHz)");
    Serial.println("   - Restart ESP32");
    while (true) {
      delay(1000);
    }
  }

  // ... rest of your setup code
}

// ========================================
// FULL EXAMPLE WITH API ENDPOINT
// ========================================

/*
#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Static IP configuration
IPAddress local_IP(192, 168, 1, 200);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);
IPAddress primaryDNS(8, 8, 8, 8);
IPAddress secondaryDNS(8, 8, 4, 4);

// API endpoint (Laptop IP: 192.168.1.7)
const char* api_get_user = "http://192.168.1.7:3000/api/iot/get-user";

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Configure static IP
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    Serial.println("Static IP configuration failed!");
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Test API call
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(api_get_user) + "?token=test&device=ESP32-BOTOL-01";
    
    http.begin(url);
    int httpCode = http.GET();
    
    Serial.print("HTTP Code: ");
    Serial.println(httpCode);
    
    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("Response: " + response);
    }
    
    http.end();
  }
}

void loop() {
  // Your code here
  delay(1000);
}
*/

// ========================================
// VERIFICATION CHECKLIST
// ========================================

/*
✅ BEFORE UPLOAD:
- [ ] Change ssid to your WiFi name
- [ ] Change password to your WiFi password
- [ ] Verify laptop IP: 192.168.1.7 (run ipconfig)
- [ ] Verify ESP32 IP: 192.168.1.200 (not conflicting with other devices)
- [ ] Verify gateway: 192.168.1.1 (check ipconfig)
- [ ] Update api_get_user URL to: http://192.168.1.7:3000/api/iot/get-user

✅ AFTER UPLOAD:
- [ ] Check Serial Monitor shows: "WiFi Connected!"
- [ ] Check Serial Monitor shows: "IP Address: 192.168.1.200"
- [ ] Test ESP32 HTTP server: http://192.168.1.200/
- [ ] Test from laptop: curl http://192.168.1.200/
- [ ] Start Next.js: npm run dev
- [ ] Check output shows: "Network: http://192.168.1.7:3000"
- [ ] Test web app: http://192.168.1.7:3000
- [ ] Test IoT auth: http://192.168.1.7:3000/iot-auth
- [ ] Test QR login from phone

✅ TROUBLESHOOTING:
- ESP32 IP different? → Update esp32Ip in src/app/(user)/iot-auth/page.tsx
- Connection timeout? → Check firewall allows port 3000
- WiFi not connecting? → Check SSID/password, use 2.4GHz WiFi
- API not working? → Check laptop runs: npm run dev -H 0.0.0.0
*/

// ========================================
// NETWORK CONFIGURATION SUMMARY
// ========================================

/*
DEVICE         | IP ADDRESS       | PORT | PROTOCOL
---------------|------------------|------|----------
WiFi Router    | 192.168.1.1      | -    | -
Laptop         | 192.168.1.7      | 3000 | HTTP
ESP32          | 192.168.1.200    | 80   | HTTP
Phone          | 192.168.1.x      | -    | -

URLS:
- Next.js Web App: http://192.168.1.7:3000
- IoT Auth Page:   http://192.168.1.7:3000/iot-auth
- API Endpoint:    http://192.168.1.7:3000/api/iot/get-user
- ESP32 Server:    http://192.168.1.200/
- Set Token:       http://192.168.1.200/set-token?token=xxx

SUBNET: 255.255.255.0 (allows 192.168.1.1 - 192.168.1.254)
*/
