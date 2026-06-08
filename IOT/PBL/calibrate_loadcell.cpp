/*
 * LOAD CELL CALIBRATION TOOL
 * 
 * Program ini digunakan untuk mengkalibrasi load cell HX711
 * Jalankan program ini SEBELUM menggunakan sistem utama
 * 
 * CARA KALIBRASI:
 * 1. Upload program ini ke ESP32
 * 2. Buka Serial Monitor (115200 baud)
 * 3. Ikuti instruksi di Serial Monitor
 * 4. Catat nilai calibration_factor yang didapat
 * 5. Update nilai di main.cpp: scale.set_scale(calibration_factor);
 */

#include <Arduino.h>
#include <HX711.h>

// Pin configuration
#define PIN_LOADCELL_DOUT 26
#define PIN_LOADCELL_SCK 27

HX711 scale;

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=================================");
  Serial.println("LOAD CELL CALIBRATION TOOL");
  Serial.println("=================================\n");
  
  // Initialize HX711
  scale.begin(PIN_LOADCELL_DOUT, PIN_LOADCELL_SCK);
  
  Serial.println("Initializing load cell...");
  delay(1000);
  
  if (scale.is_ready()) {
    Serial.println("✅ Load cell ready!");
  } else {
    Serial.println("❌ Load cell not found!");
    Serial.println("Check wiring:");
    Serial.println("  DT  -> GPIO 26");
    Serial.println("  SCK -> GPIO 27");
    Serial.println("  VCC -> 3.3V");
    Serial.println("  GND -> GND");
    while (1);
  }
  
  Serial.println("\n=================================");
  Serial.println("STEP 1: TARE (Reset to Zero)");
  Serial.println("=================================");
  Serial.println("Remove all weight from the load cell");
  Serial.println("Press any key when ready...");
  
  while (!Serial.available());
  while (Serial.available()) Serial.read();
  
  Serial.println("\nTaring...");
  scale.tare();
  delay(1000);
  
  Serial.println("✅ Tare complete!");
  Serial.print("Zero value: ");
  Serial.println(scale.read_average(10));
  
  Serial.println("\n=================================");
  Serial.println("STEP 2: CALIBRATION");
  Serial.println("=================================");
  Serial.println("Place a known weight on the load cell");
  Serial.println("Recommended: 100g, 200g, or 500g");
  Serial.println("\nEnter the weight in grams (e.g., 100):");
  
  while (!Serial.available());
  float known_weight = Serial.parseFloat();
  while (Serial.available()) Serial.read();
  
  Serial.print("\nYou entered: ");
  Serial.print(known_weight, 1);
  Serial.println(" grams");
  Serial.println("\nPlace the weight on the load cell now");
  Serial.println("Press any key when ready...");
  
  while (!Serial.available());
  while (Serial.available()) Serial.read();
  
  Serial.println("\nReading weight...");
  delay(1000);
  
  long reading = scale.read_average(20);
  float calibration_factor = reading / known_weight;
  
  Serial.println("\n=================================");
  Serial.println("CALIBRATION RESULT");
  Serial.println("=================================");
  Serial.print("Raw reading: ");
  Serial.println(reading);
  Serial.print("Known weight: ");
  Serial.print(known_weight, 1);
  Serial.println(" g");
  Serial.print("Calibration factor: ");
  Serial.println(calibration_factor, 4);
  
  Serial.println("\n=================================");
  Serial.println("NEXT STEPS");
  Serial.println("=================================");
  Serial.println("1. Copy this line to main.cpp:");
  Serial.print("   scale.set_scale(");
  Serial.print(calibration_factor, 4);
  Serial.println(");");
  Serial.println("\n2. Replace the existing line:");
  Serial.println("   scale.set_scale(420.0983);");
  Serial.println("\n3. Upload main.cpp to ESP32");
  
  Serial.println("\n=================================");
  Serial.println("TESTING");
  Serial.println("=================================");
  Serial.println("Remove the weight and press any key to test...");
  
  while (!Serial.available());
  while (Serial.available()) Serial.read();
  
  scale.set_scale(calibration_factor);
  scale.tare();
  
  Serial.println("\nPlace different weights to test accuracy");
  Serial.println("Press 'r' to reset, 'q' to quit\n");
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd == 'r' || cmd == 'R') {
      Serial.println("\nResetting to zero...");
      scale.tare();
      Serial.println("✅ Reset complete!");
    } else if (cmd == 'q' || cmd == 'Q') {
      Serial.println("\nCalibration complete!");
      Serial.println("You can now upload main.cpp");
      while (1);
    }
  }
  
  if (scale.is_ready()) {
    float weight = scale.get_units(10);
    
    Serial.print("Weight: ");
    Serial.print(weight, 1);
    Serial.println(" g");
    
    delay(500);
  } else {
    Serial.println("Load cell not ready");
    delay(1000);
  }
}
