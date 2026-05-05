"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  getCurrentUserProfile, 
  updateBasicProfile,
  updateExtendedProfile, 
  syncProfileData,
  type UserProfileDetail 
} from "@/services/profile-no-sql.service";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Building2, Coins, TrendingUp, Edit2, Check, X } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    nomor_hp: "",
    alamat: "",
    kecamatan: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Sync profile data first
        await syncProfileData();
        
        const userProfile = await getCurrentUserProfile();
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            full_name: userProfile.full_name || "",
            nomor_hp: userProfile.nomor_hp || "",
            alamat: userProfile.alamat || "",
            kecamatan: userProfile.kecamatan || "",
          });
        } else {
          router.push("/login");
        }
      } catch {
        // ignore error
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update basic profile (full_name) ke database
      await updateBasicProfile({
        full_name: formData.full_name,
      });

      // Update extended profile (nomor_hp, alamat, kecamatan) ke localStorage
      await updateExtendedProfile({
        nomor_hp: formData.nomor_hp,
        alamat: formData.alamat,
        kecamatan: formData.kecamatan,
      });

      setSuccess("Profil berhasil diperbarui!");
      setIsEditing(false);
      
      // Refresh profile
      const updatedProfile = await getCurrentUserProfile();
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <p className="text-slate-600">Profil tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 border border-red-200 flex gap-2">
            <X size={20} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 flex gap-2">
            <Check size={20} className="flex-shrink-0" />
            <div>{success}</div>
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-3xl bg-white shadow-xl overflow-hidden">
          {/* Header Background */}
          <div className="h-40 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Profile Header with Avatar - Centered */}
            <div className="flex flex-col items-center -mt-20 mb-8">
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-2xl border-8 border-white flex-shrink-0 mb-4">
                <span className="text-5xl font-bold">{getInitials(profile.full_name || "User")}</span>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">{profile.full_name || "User"}</h1>
                <p className="text-sm text-slate-500 mt-2">
                  {profile.auth_provider === "email" ? "Email & Password" : profile.auth_provider?.toUpperCase() || "Email"}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-emerald-500 rounded-lg text-white">
                    <Coins size={20} />
                  </div>
                  <p className="text-sm font-medium text-emerald-700">Saldo Poin</p>
                </div>
                <p className="text-3xl font-bold text-emerald-900">{profile.saldo_point || 0}</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-500 rounded-lg text-white">
                    <TrendingUp size={20} />
                  </div>
                  <p className="text-sm font-medium text-blue-700">Total Transaksi</p>
                </div>
                <p className="text-3xl font-bold text-blue-900">{profile.total_transaksi || 0}</p>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-8 border-slate-200" />

            {/* Profile Information */}
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Informasi Profil</h2>

            {isEditing ? (
              /* Edit Form */
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Nama Lengkap</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Nomor HP</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      name="nomor_hp"
                      value={formData.nomor_hp}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      placeholder="081234567890"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Alamat</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <textarea
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition resize-none"
                      placeholder="Masukkan alamat lengkap Anda"
                      rows={3}
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Kecamatan</label>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-4 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      name="kecamatan"
                      value={formData.kecamatan}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                      placeholder="Nama kecamatan"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    disabled={isSaving}
                    className="rounded-xl"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </div>
            ) : (
              /* Display View */
              <div className="space-y-5">
                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0 mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.email || "-"}</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600 flex-shrink-0 mt-0.5">
                    <span className="text-lg font-bold">👤</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nama Lengkap</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.full_name || "-"}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600 flex-shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Nomor HP</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.nomor_hp || "-"}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-orange-100 rounded-lg text-orange-600 flex-shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Alamat</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.alamat || "-"}</p>
                  </div>
                </div>

                {/* District */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-3 bg-pink-100 rounded-lg text-pink-600 flex-shrink-0 mt-0.5">
                    <Building2 size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Kecamatan</p>
                    <p className="text-slate-900 font-medium mt-1">{profile.kecamatan || "-"}</p>
                  </div>
                </div>

                {/* Edit Button */}
                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-xl mt-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <Edit2 size={18} className="mr-2" />
                  Edit Profil
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
