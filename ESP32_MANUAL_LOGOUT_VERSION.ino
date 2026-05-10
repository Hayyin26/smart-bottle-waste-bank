// BAGIAN YANG DIUBAH: Manual Logout Version
// Ganti bagian WAIT_PASS state dengan kode ini:

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
    
    // ⚠️ TIDAK AUTO-LOGOUT! User tetap login
    // User bisa langsung masukkan botol lagi
    if (USE_QR_LOGIN && current_user_id.length() > 0) {
      lcdPrintLine(0, current_user_name.substring(0, 16));
      lcdPrintLine(1, "MASUKKAN LAGI?");
      delay(2000);
    }
    
    // Reset bottle size
    currentBottleSize = NONE;
    currentBottlePoints = 0;
    
    // Kembali ke WAIT_BOTTLE (bukan WAIT_USER)
    // User tetap login!
    gateState = WAIT_BOTTLE;
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

// TAMBAHAN: Logout manual via command atau button
// Di bagian serial commands, tambahkan:

else if (command == "LOGOUT") {
  if (USE_QR_LOGIN && current_user_id.length() > 0) {
    deleteSession();
    Serial.println("[Command] Logged out");
    lcdPrintLine(0, "LOGGED OUT");
    lcdPrintLine(1, "SCAN QR AGAIN");
    buzzShort(2);
    delay(2000);
  }
}

// TAMBAHAN: Auto-logout jika tidak ada aktivitas (5 menit)
// Di bagian loop(), tambahkan:

unsigned long lastActivityTime = 0;
#define INACTIVITY_TIMEOUT 300000 // 5 menit

// Update lastActivityTime setiap ada aktivitas
if (bottlePresent) {
  lastActivityTime = millis();
}

// Auto-logout jika tidak ada aktivitas
if (USE_QR_LOGIN && current_user_id.length() > 0) {
  if (millis() - lastActivityTime > INACTIVITY_TIMEOUT) {
    Serial.println("[Session] Auto-logout due to inactivity");
    deleteSession();
    lcdPrintLine(0, "SESSION TIMEOUT");
    lcdPrintLine(1, "SCAN QR AGAIN");
    buzzShort(3);
    delay(2000);
    lastActivityTime = millis();
  }
}
