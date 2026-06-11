"use client";

import Container from "@/components/container";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function DeviceQRPage() {
  const [deviceId, setDeviceId] = useState("ESP32-BOTOL-01");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-generate QR on load (only on client)
    if (mounted) {
      generatePermanentQR();
    }
  }, [mounted]);

  async function generatePermanentQR() {
    if (!mounted) return; // Don't run on server
    
    setLoading(true);
    try {
      // Generate permanent QR code URL (no session token needed)
      // User will login directly and IoT will check active sessions
      const url = `${window.location.origin}/iot-auth?device=${deviceId}`;
      
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 500,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  }

  function downloadQR() {
    if (!qrCodeUrl) return;
    
    const link = document.createElement("a");
    link.download = `device-qr-${deviceId}.png`;
    link.href = qrCodeUrl;
    link.click();
  }

  function printQR() {
    if (!qrCodeUrl) return;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Device QR Code - ${deviceId}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background: white;
              }
              .container {
                text-align: center;
                padding: 40px;
              }
              img {
                max-width: 500px;
                margin: 30px auto;
                border: 8px solid #1e40af;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              }
              h1 {
                font-size: 36px;
                margin: 10px;
                color: #1e40af;
              }
              h2 {
                font-size: 24px;
                margin: 10px;
                color: #333;
              }
              .device {
                background: #f3f4f6;
                padding: 15px 30px;
                border-radius: 12px;
                margin: 20px auto;
                display: inline-block;
              }
              .instructions {
                background: #dbeafe;
                padding: 20px;
                border-radius: 12px;
                margin: 20px auto;
                max-width: 500px;
                text-align: left;
              }
              .instructions h3 {
                color: #1e40af;
                margin-top: 0;
              }
              .instructions ol {
                margin: 10px 0;
                padding-left: 20px;
              }
              .instructions li {
                margin: 8px 0;
                color: #1f2937;
              }
              @media print {
                body {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🏦 Bank Sampah Digital</h1>
              <h2>Scan untuk Login & Mulai Transaksi</h2>
              
              <img src="${qrCodeUrl}" alt="QR Code" />
              
              <div class="device">
                <p style="margin: 0; font-size: 18px;"><strong>Device ID:</strong> ${deviceId}</p>
              </div>

              <div class="instructions">
                <h3>📱 Cara Menggunakan:</h3>
                <ol>
                  <li>Scan QR code dengan smartphone</li>
                  <li>Login atau daftar akun baru</li>
                  <li>Masukkan botol plastik ke device</li>
                  <li>Dapatkan poin otomatis!</li>
                  <li>Cek poin Anda di dashboard</li>
                </ol>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                QR Code ini permanen dan dapat digunakan berkali-kali
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <h1 className="text-3xl font-bold">Device QR Code (Permanent)</h1>
        <p className="text-muted-foreground">
          QR code permanen untuk device IoT - Print sekali, pakai selamanya!
        </p>
      </Container>

      <Container className="py-6">
        {!mounted ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
          {/* Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sistem QR Code Permanen:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-2 list-decimal list-inside">
              <li><strong>Print QR Code:</strong> Print sekali dan tempel di device IoT</li>
              <li><strong>User Scan:</strong> User scan QR dengan smartphone kapan saja</li>
              <li><strong>Login/Register:</strong> User login atau daftar akun baru</li>
              <li><strong>Auto Connect:</strong> IoT otomatis tahu siapa yang login</li>
              <li><strong>Transaksi:</strong> User masukkan botol, poin masuk ke akun mereka</li>
              <li><strong>Dashboard:</strong> User bisa cek poin dan history di dashboard</li>
            </ol>
          </div>

          {/* Device ID Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Device ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 font-mono"
                placeholder="ESP32-BOTOL-01"
              />
              <button
                onClick={generatePermanentQR}
                disabled={loading || !deviceId}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Update"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              ⚠️ Pastikan Device ID sama dengan yang ada di code ESP32
            </p>
          </div>

          {/* QR Code Display */}
          {qrCodeUrl && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border-4 border-blue-500 shadow-2xl">
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-2 text-blue-900 dark:text-blue-300">
                    🏦 Smart Bottle Waste Bank
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Scan untuk Login & Mulai Transaksi
                  </p>
                  
                  <div className="bg-white p-6 rounded-xl shadow-inner border-4 border-gray-200">
                    <img src={qrCodeUrl} alt="QR Code" className="w-96 h-96" />
                  </div>
                  
                  <div className="mt-6 text-center space-y-2">
                    <div className="bg-blue-100 dark:bg-blue-900 px-6 py-3 rounded-lg">
                      <p className="font-bold text-lg text-blue-900 dark:text-blue-100">
                        Device: {deviceId}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      ✅ QR Code Permanen - Tidak Perlu Generate Ulang
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={downloadQR}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
                
                <button
                  onClick={printQR}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>

              {/* Important Notes */}
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                        Keuntungan QR Permanen:
                      </p>
                      <ul className="text-sm text-green-700 dark:text-green-400 mt-1 space-y-1">
                        <li>✓ Print sekali, pakai selamanya</li>
                        <li>✓ Tidak perlu generate ulang</li>
                        <li>✓ User bisa login kapan saja</li>
                        <li>✓ Otomatis redirect ke dashboard user</li>
                        <li>✓ User bisa cek poin dan history</li>
                        <li>✓ Support unlimited users</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                        Cara Kerja:
                      </p>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
                        <li>1. User scan QR → Login/Register</li>
                        <li>2. Session tersimpan di database (5 menit)</li>
                        <li>3. ESP32 cek session aktif setiap 30 detik</li>
                        <li>4. User masukkan botol → Poin masuk ke akun</li>
                        <li>5. User bisa cek dashboard kapan saja</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex gap-2">
                    <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                        Setup ESP32:
                      </p>
                      <ul className="text-sm text-yellow-700 dark:text-yellow-400 mt-1 space-y-1">
                        <li>• Set <code>USE_QR_LOGIN = true</code> di ESP32</li>
                        <li>• Update <code>api_get_user</code> dengan URL production</li>
                        <li>• ESP32 akan cek session aktif otomatis</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </Container>
    </div>
  );
}
