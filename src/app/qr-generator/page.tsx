"use client";

import Container from "@/components/container";
import { getProfiles } from "@/services/profiles.service";
import { useState, useEffect } from "react";
import { QrCode, Download, User } from "lucide-react";
import type { Profile } from "@/services/profiles.service";

export default function QRGeneratorPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const data = await getProfiles();
    setProfiles(data);
    setLoading(false);
  }

  const generateQRCodeUrl = (userId: string) => {
    // Using QR Code API
    const qrData = encodeURIComponent(`user://${userId}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
  };

  const downloadQRCode = async (userId: string, userName: string) => {
    const url = generateQRCodeUrl(userId);
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qr-${userName.replace(/\s+/g, '-')}.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">QR Code Generator</h1>
            <p className="text-muted-foreground">
              Generate QR codes untuk user scan di IoT device
            </p>
          </div>
        </div>
      </Container>

      {/* User Selection */}
      <Container className="py-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Pilih User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-4 py-2 dark:bg-slate-900"
            >
              <option value="">-- Pilih User --</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.full_name || 'Anonymous'} ({profile.total_points} points)
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <div className="rounded-lg border border-border bg-white p-6 dark:bg-slate-900">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg border-4 border-blue-600 p-4">
                  <img
                    src={generateQRCodeUrl(selectedUser)}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
                
                <div className="text-center">
                  <p className="font-semibold text-lg">
                    {profiles.find(p => p.id === selectedUser)?.full_name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono mt-1">
                    {selectedUser}
                  </p>
                </div>

                <button
                  onClick={() => {
                    const user = profiles.find(p => p.id === selectedUser);
                    if (user) {
                      downloadQRCode(selectedUser, user.full_name || 'user');
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  Download QR Code
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* All Users Grid */}
      <Container className="py-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Users</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-lg border border-border bg-white p-4 hover:shadow-md transition-shadow dark:bg-slate-900"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <User size={20} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.full_name || 'Anonymous'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.total_points} points
                      </p>
                    </div>
                  </div>
                  {profile.role === 'admin' && (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      Admin
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center bg-slate-50 rounded-lg p-3 mb-3 dark:bg-slate-800">
                  <img
                    src={generateQRCodeUrl(profile.id)}
                    alt={`QR Code for ${profile.full_name}`}
                    className="w-32 h-32"
                  />
                </div>

                <button
                  onClick={() => downloadQRCode(profile.id, profile.full_name || 'user')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* Instructions */}
      <Container className="py-4">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📱 Cara Menggunakan QR Code
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>1. Download QR code untuk user</li>
            <li>2. Print atau tampilkan QR code di device user</li>
            <li>3. User scan QR code di IoT device</li>
            <li>4. Points otomatis ditambahkan ke akun user</li>
            <li>5. Transaksi tercatat di dashboard secara real-time</li>
          </ol>
        </div>
      </Container>
    </div>
  );
}
