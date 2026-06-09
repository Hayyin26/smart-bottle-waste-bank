"use client";

import { Suspense, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import QRCode from "qrcode";

function IotAuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deviceId = searchParams.get("device") || "ESP32-BOTOL-01";
  const redirect = searchParams.get("redirect") || "/user";
  
  // Generate session token - fixed hydration issue
  const [sessionToken, setSessionToken] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  // ESP32 IP with auto-discovery from server
  const [esp32Ip, setEsp32Ip] = useState(() => {
    // Load from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      return localStorage.getItem('esp32Ip') || "";
    }
    return "";
  });
  
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [tempIp, setTempIp] = useState(esp32Ip);
  const [isLoadingIp, setIsLoadingIp] = useState(false);
  const [ipFetchError, setIpFetchError] = useState("");
  
  // Auto-fetch ESP32 IP from server
  const fetchEsp32Ip = async () => {
    setIsLoadingIp(true);
    setIpFetchError("");
    
    try {
      const response = await fetch(`/api/iot/register-device?device=${deviceId}`);
      const data = await response.json();
      
      if (response.ok && data.ip_address) {
        console.log("[IoT Auth] ✅ Auto-discovered ESP32 IP:", data.ip_address);
        setEsp32Ip(data.ip_address);
        if (typeof window !== 'undefined') {
          localStorage.setItem('esp32Ip', data.ip_address);
        }
        
        // Show online status
        if (data.is_online) {
          console.log("[IoT Auth] Device is online!");
        } else {
          console.log("[IoT Auth] ⚠️ Device last seen:", data.last_seen);
          setIpFetchError("Device offline. Last seen: " + new Date(data.last_seen).toLocaleString());
        }
      } else {
        console.log("[IoT Auth] ⚠️ Device not found, using manual IP");
        setIpFetchError("Device not registered yet. Please enter IP manually.");
      }
    } catch (error) {
      console.error("[IoT Auth] Error fetching IP:", error);
      setIpFetchError("Failed to fetch device IP. Please enter manually.");
    } finally {
      setIsLoadingIp(false);
    }
  };
  
  // Fetch IP on mount
  useEffect(() => {
    if (!esp32Ip) {
      fetchEsp32Ip();
    }
  }, []);
  
  // Save ESP32 IP to localStorage
  const saveEsp32Ip = (newIp: string) => {
    setEsp32Ip(newIp);
    if (typeof window !== 'undefined') {
      localStorage.setItem('esp32Ip', newIp);
    }
    setIsEditingIp(false);
  };
  
  // Generate QR code helper function
  const generateQrCode = async (token: string) => {
    try {
      const qrData = `http://${esp32Ip}/set-token?token=${token}&device=${deviceId}`;
      console.log("[IoT Auth] QR Code URL:", qrData);
      const qrImage = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrImage);
    } catch (qrError) {
      console.error("QR Code generation error:", qrError);
    }
  };

  // Handle IP update
  const handleIpUpdate = () => {
    // Validate IP format (basic)
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(tempIp)) {
      saveEsp32Ip(tempIp);
      // Regenerate QR code with new IP if session exists
      if (sessionToken) {
        generateQrCode(sessionToken);
      }
    } else {
      alert("Invalid IP format! Use format: 192.168.1.XXX");
    }
  };
  
  useEffect(() => {
    // Generate token only on client side to avoid hydration mismatch
    const token = searchParams.get("token");
    if (token) {
      setSessionToken(token);
    } else {
      // Generate new session token for permanent QR
      const newToken = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      setSessionToken(newToken);
    }
  }, [searchParams]);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if already logged in
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Already logged in, save to IoT session
      await saveIotSession(session.user.id);
    }
  }

  async function saveIotSession(userId: string) {
    try {
      // Check if sessionToken is ready
      if (!sessionToken) {
        // Token belum ready, tunggu sebentar
        console.log("[IoT Auth] Session token not ready yet");
        return;
      }
      
      console.log("[IoT Auth] Saving session to database...");
      console.log("[IoT Auth] Token:", sessionToken);
      console.log("[IoT Auth] User ID:", userId);
      console.log("[IoT Auth] Device ID:", deviceId);
      
      // Save session to database for IoT to read
      const { error } = await supabase
        .from("iot_sessions")
        .upsert({
          session_token: sessionToken,
          user_id: userId,
          device_id: deviceId,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes (1 hour)
        });

      if (error) {
        console.error("[IoT Auth] Error saving session:", error);
        throw error;
      }
      
      console.log("[IoT Auth] ✅ Session saved successfully!");

      // Generate QR code for auto-login
      await generateQrCode(sessionToken);

      setSuccess(true);
      setError("");
      
      // Don't auto-redirect, let user scan QR first
      // setTimeout(() => {
      //   router.push(redirect);
      // }, 2000);
    } catch (err: any) {
      console.error("Error saving session:", err);
      setError("Gagal menyimpan sesi: " + err.message);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has 'user' role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          throw new Error('Tidak dapat mengakses profil pengguna');
        }

        if (profile.role !== 'user') {
          // Wrong role - logout
          await supabase.auth.signOut();
          throw new Error('Akun Anda bukan user biasa. Silakan gunakan akun user untuk login di sini.');
        }

        await saveIotSession(data.user.id);
      }
    } catch (err: any) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Register user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create profile - TANPA kolom email (email ada di auth.users)
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: "user",
            total_points: 0,
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Jika profile sudah ada (duplicate), lanjutkan saja
          if (profileError.code !== "23505") {
            throw new Error("Gagal membuat profile: " + profileError.message);
          }
        }

        await saveIotSession(data.user.id);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  // Show loading while sessionToken is being generated
  if (!sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Berhasil!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Scan QR code di bawah dengan HP Anda untuk login ke device IoT
          </p>
          
          {/* QR Code */}
          {qrCodeUrl && (
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 mb-6 shadow-inner">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="mx-auto rounded-lg"
                style={{ width: '300px', height: '300px' }}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                📱 Scan QR code ini dengan kamera HP
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              <strong>Device:</strong> {deviceId}
            </p>
            
            {/* ESP32 IP Configuration */}
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                <strong>ESP32 IP Address:</strong>
              </p>
              
              {isLoadingIp && (
                <div className="bg-white dark:bg-slate-800 rounded px-3 py-2 text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    🔍 Auto-discovering device...
                  </p>
                </div>
              )}
              
              {!isLoadingIp && !isEditingIp && esp32Ip && (
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded px-3 py-2">
                  <code className="text-sm text-blue-900 dark:text-blue-200">{esp32Ip}</code>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTempIp(esp32Ip);
                        setIsEditingIp(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={fetchEsp32Ip}
                      className="text-xs text-green-600 hover:text-green-700 dark:text-green-400"
                      title="Refresh IP from server"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              )}
              
              {!isLoadingIp && !isEditingIp && !esp32Ip && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded px-3 py-2">
                  <p className="text-xs text-yellow-800 dark:text-yellow-300 mb-2">
                    Device not found. Please enter IP manually:
                  </p>
                  <button
                    onClick={() => {
                      setTempIp("");
                      setIsEditingIp(true);
                    }}
                    className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
                  >
                    ➕ Enter IP Manually
                  </button>
                </div>
              )}
              
              {ipFetchError && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                  ⚠️ {ipFetchError}
                </p>
              )}
              
              {isEditingIp && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={tempIp}
                    onChange={(e) => setTempIp(e.target.value)}
                    placeholder="192.168.1.XXX"
                    className="w-full px-3 py-2 text-sm border rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleIpUpdate}
                      className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                    >
                      ✓ Save
                    </button>
                    <button
                      onClick={() => {
                        setTempIp(esp32Ip);
                        setIsEditingIp(false);
                      }}
                      className="flex-1 text-xs bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded"
                    >
                      ✗ Cancel
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                💡 IP auto-updates when ESP32 connects
              </p>
            </div>
            
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-3">
              Setelah scan, HP akan otomatis kirim data ke device
            </p>
          </div>
          
          {/* Manual option (backup) */}
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              🔧 Opsi Manual (untuk developer)
            </summary>
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                Kirim command ini ke ESP32 Serial Monitor:
              </p>
              <div className="bg-white dark:bg-slate-900 rounded p-2 mb-2">
                <code className="text-xs text-gray-800 dark:text-gray-200 break-all">
                  TOKEN:{sessionToken}
                </code>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`TOKEN:${sessionToken}`);
                  alert("Token copied to clipboard!");
                }}
                className="text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
              >
                📋 Copy Token
              </button>
            </div>
          </details>
          
          <div className="mt-6">
            <button
              onClick={() => router.push(redirect)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Lanjut ke Dashboard →
            </button>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Sesi akan berakhir dalam 1 jam atau setelah transaksi selesai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            IoT Bank Sampah
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Login atau daftar untuk memulai transaksi
          </p>
          <div className="mt-4 bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              <strong>Device:</strong> {deviceId}
            </p>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === "login" ? handleLogin : handleRegister}>
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="email@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </span>
            ) : mode === "login" ? (
              "Login"
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan Bank Sampah Digital
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IotAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <IotAuthContent />
    </Suspense>
  );
}
