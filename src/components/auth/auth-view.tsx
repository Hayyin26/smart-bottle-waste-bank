"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithGitHub,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Feedback = {
  type: "info" | "success";
  message: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authCopy = {
  login: {
    badge: "Login pengguna",
    title: "Masuk ke Smart Bottle Waste Bank",
    description:
      "Gunakan akun Anda untuk mengakses dashboard, riwayat transaksi, dan data bank sampah.",
    submitLabel: "Masuk",
    helperText: "Belum punya akun?",
    helperLink: "/register",
    helperLinkLabel: "Daftar di sini",
    successMessage:
      "Anda berhasil login! Sedang mengarahkan ke dashboard...",
  },
  register: {
    badge: "Register akun",
    title: "Buat akun baru",
    description:
      "Daftarkan akun Anda terlebih dulu, lalu nanti bisa dilanjutkan ke integrasi autentikasi Supabase.",
    submitLabel: "Buat akun",
    helperText: "Sudah punya akun?",
    helperLink: "/login",
    helperLinkLabel: "Masuk di sini",
    successMessage:
      "Akun berhasil dibuat! Sedang mengarahkan ke login...",
  },
} satisfies Record<
  AuthMode,
  {
    badge: string;
    title: string;
    description: string;
    submitLabel: string;
    helperText: string;
    helperLink: string;
    helperLinkLabel: string;
    successMessage: string;
  }
>;

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 12.23c0-.765-.068-1.5-.195-2.208H12v4.177h5.494a4.699 4.699 0 0 1-2.038 3.084v2.562h3.306c1.935-1.783 3.043-4.41 3.043-7.615Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.074-.915 6.762-2.477l-3.306-2.562c-.915.615-2.085.982-3.456.982-2.655 0-4.904-1.793-5.707-4.2H2.876v2.645A9.998 9.998 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.293 13.743A5.998 5.998 0 0 1 5.974 12c0-.605.11-1.192.319-1.743V7.612H2.876A9.997 9.997 0 0 0 2 12c0 1.61.385 3.135 1.066 4.388l3.227-2.645Z"
        fill="#FBBC04"
      />
      <path
        d="M12 6.057c1.5 0 2.846.515 3.908 1.525l2.928-2.928C17.069 3.02 14.756 2 12 2a9.998 9.998 0 0 0-9.124 5.612l3.417 2.645c.803-2.407 3.052-4.2 5.707-4.2Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AuthInput({
  className,
  error,
  icon,
  rightSlot,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          className={cn(
            "h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
            error && "border-rose-300 focus:border-rose-500 focus:ring-rose-100",
            className,
          )}
          {...props}
        />
        {rightSlot ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</span>
        ) : null}
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </label>
  );
}

export function AuthView({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const copy = authCopy[mode];
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const updateValue =
    (field: keyof FormValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
      setFeedback(null);
    };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (mode === "register" && !values.fullName.trim()) {
      nextErrors.fullName = "Nama lengkap wajib diisi.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = "Format email belum valid.";
    }

    if (!values.password) {
      nextErrors.password = "Password wajib diisi.";
    } else if (mode === "register" && values.password.length < 8) {
      nextErrors.password = "Password minimal 8 karakter.";
    }

    if (mode === "register") {
      if (!values.confirmPassword) {
        nextErrors.confirmPassword = "Konfirmasi password wajib diisi.";
      } else if (values.confirmPassword !== values.password) {
        nextErrors.confirmPassword = "Konfirmasi password belum sama.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      if (mode === "login") {
        await signInWithEmail(values.email, values.password);
        
        // Sinkronisasi profile setelah login
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const user = session.user;
          
          // Update profil untuk memastikan data terbaru
          await supabase
            .from('profiles')
            .update({
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();
        }
      } else {
        // Register mode - check if email already exists
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: 'dummy', // This will fail but helps check if email exists
        }).catch(() => ({ data: null }));

        // If we got here without error in actual flow, email might exist
        // But we'll let Supabase handle the actual duplicate check
        await signUpWithEmail(values.email, values.password, values.fullName);
      }

      setFeedback({ type: "success", message: copy.successMessage });
      
      // Redirect setelah 1 detik
      setTimeout(() => {
        router.push(process.env.NEXT_PUBLIC_REDIRECT_URL || "/dashboard");
      }, 1000);
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      
      // Improve error messages
      if (errorMessage.includes('User already registered')) {
        errorMessage = 'Email ini sudah terdaftar. Silakan gunakan email lain atau coba login.';
      } else if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email atau password salah.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Email belum dikonfirmasi. Silakan cek email Anda.';
      } else if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'Password minimal harus 8 karakter.';
      }
      
      setFeedback({
        type: "info",
        message: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  const handleProviderClick = async (provider: "Google" | "GitHub") => {
    setFeedback(null);
    setIsSubmitting(true);

    try {
      if (provider === "Google") {
        await signInWithGoogle();
      } else if (provider === "GitHub") {
        await signInWithGitHub();
      }
    } catch (error) {
      let errorMessage = error instanceof Error ? error.message : `Login dengan ${provider} gagal`;
      
      // Improve error messages untuk OAuth
      if (errorMessage.includes('PKCE')) {
        errorMessage = `Login dengan ${provider} tidak dapat diproses. Silakan coba lagi.`;
      } else if (errorMessage.includes('redirect')) {
        errorMessage = `Gagal mengarahkan ke ${provider}. Silakan coba lagi.`;
      }
      
      setFeedback({
        type: "info",
        message: errorMessage,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[linear-gradient(135deg,#f6fbf8_0%,#eefaf3_45%,#fcfefc_100%)] text-slate-950"
      data-auth-page="true"
    >
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#0f3d2e_0%,#0b5f49_55%,#0f8f65_100%)] px-10 py-12 text-white lg:flex">
          <div className="absolute inset-0">
            <div className="absolute -left-20 top-12 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-lime-200/10 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20 backdrop-blur">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald-100/80">
                  Smart Bottle
                </p>
                <h1 className="text-lg font-semibold">Waste Bank Portal</h1>
              </div>  
            </div>

            <div className="space-y-12">
              <div className="max-w-sm space-y-4">
                <p className="text-lg font-semibold leading-relaxed">
                  Platform manajemen bank sampah yang cerdas dan terintegrasi IoT
                </p>
                <p className="text-emerald-100/80 leading-relaxed">
                  Kelola sampah plastik dengan lebih efisien, tingkatkan partisipasi nasabah, dan pantau stok sampah secara real-time dengan teknologi IoT terkini.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-400/20">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Aman & Terpercaya</h3>
                    <p className="text-sm text-emerald-100/70">Sistem autentikasi berlapis dengan enkripsi tingkat enterprise</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-lime-400/20">
                    <Leaf className="h-5 w-5 text-lime-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ramah Lingkungan</h3>
                    <p className="text-sm text-emerald-100/70">Mendukung pengelolaan sampah berkelanjutan dan daur ulang</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-300/20">
                    <Mail className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-time Monitoring</h3>
                    <p className="text-sm text-emerald-100/70">Pantau perangkat IoT dan transaksi sampah secara langsung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10">
          <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-lime-100/60 blur-3xl" />

          <div className="relative w-full max-w-xl">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-300/40">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">
                  Smart Bottle
                </p>
                <h1 className="text-lg font-semibold text-slate-900">Waste Bank Portal</h1>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-emerald-100/70 bg-white/85 p-6 shadow-[0_24px_80px_-32px_rgba(15,61,46,0.35)] backdrop-blur sm:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  {copy.badge}
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {copy.title}
                  </h2>
                  <p className="text-sm leading-6 text-slate-600">{copy.description}</p>
                </div>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {mode === "register" ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Nama lengkap</p>
                    <AuthInput
                      autoComplete="name"
                      error={errors.fullName}
                      icon={<UserRound className="h-4 w-4" />}
                      onChange={updateValue("fullName")}
                      placeholder="Masukkan nama lengkap"
                      value={values.fullName}
                    />
                  </div>
                ) : null}

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Email</p>
                  <AuthInput
                    autoComplete="email"
                    error={errors.email}
                    icon={<Mail className="h-4 w-4" />}
                    onChange={updateValue("email")}
                    placeholder="nama@email.com"
                    type="email"
                    value={values.email}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-700">Password</p>
                  <AuthInput
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    error={errors.password}
                    icon={<LockKeyhole className="h-4 w-4" />}
                    onChange={updateValue("password")}
                    placeholder="Masukkan password"
                    rightSlot={
                      <button
                        aria-label={passwordVisible ? "Sembunyikan password" : "Tampilkan password"}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => setPasswordVisible((current) => !current)}
                        tabIndex={-1}
                        type="button"
                      >
                        {passwordVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    type={passwordVisible ? "text" : "password"}
                    value={values.password}
                  />
                </div>

                {mode === "register" ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Konfirmasi password</p>
                    <AuthInput
                      autoComplete="new-password"
                      error={errors.confirmPassword}
                      icon={<LockKeyhole className="h-4 w-4" />}
                      onChange={updateValue("confirmPassword")}
                      placeholder="Ulangi password"
                      rightSlot={
                        <button
                          aria-label={
                            confirmPasswordVisible
                              ? "Sembunyikan konfirmasi password"
                              : "Tampilkan konfirmasi password"
                          }
                          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          onClick={() => setConfirmPasswordVisible((current) => !current)}
                          tabIndex={-1}
                          type="button"
                        >
                          {confirmPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                      type={confirmPasswordVisible ? "text" : "password"}
                      value={values.confirmPassword}
                    />
                  </div>
                ) : null}

                <Button
                  className="h-12 w-full rounded-2xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Memproses..." : copy.submitLabel}
                  {isSubmitting ? null : <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                  atau lanjutkan dengan
                </p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  className="h-12 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={isSubmitting}
                  onClick={() => handleProviderClick("Google")}
                  type="button"
                  variant="outline"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Google
                </Button>
                <Button
                  className="h-12 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={isSubmitting}
                  onClick={() => handleProviderClick("GitHub")}
                  type="button"
                  variant="outline"
                >
                  <Github className="h-5 w-5" />
                  GitHub
                </Button>
              </div>

              {feedback ? (
                <div
                  className={cn(
                    "mt-6 rounded-2xl border px-4 py-3 text-sm leading-6",
                    feedback.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-sky-200 bg-sky-50 text-sky-800",
                  )}
                >
                  {feedback.message}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-600">{copy.helperText}</p>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  href={copy.helperLink}
                >
                  {copy.helperLinkLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
