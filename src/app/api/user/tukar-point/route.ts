import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables for tukar-point route.");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("SUPABASE_SERVICE_ROLE_KEY:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.error("NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:", !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY);
}

const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "", {
  auth: { persistSession: false },
});

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Server configuration error: SUPABASE_SERVICE_ROLE_KEY atau NEXT_PUBLIC_SUPABASE_URL belum diset." },
      { status: 500 }
    );
  }

  try {
    const authorization = request.headers.get("authorization") || request.headers.get("Authorization") || "";
    const token = authorization.replace("Bearer", "").trim();

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: token tidak ditemukan." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      console.error("Supabase auth.getUser error:", userError);
      return NextResponse.json({ error: "Unauthorized: gagal memverifikasi token." }, { status: 401 });
    }

    const userId = userData.user.id;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("saldo_point, total_points")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      console.error("Error fetching profile for convert:", profileError);
      return NextResponse.json({ error: "Gagal mengambil profil." }, { status: 500 });
    }

    const pointsToConvert = profile.total_points || 0;
    if (pointsToConvert <= 0) {
      return NextResponse.json({ error: "Tidak ada point untuk ditukar." }, { status: 400 });
    }

    const newSaldo = (profile.saldo_point || 0) + pointsToConvert;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        saldo_point: newSaldo,
        total_points: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile on convert:", error);
      return NextResponse.json({ error: "Gagal menukar point." }, { status: 500 });
    }

    return NextResponse.json({ message: "Point berhasil ditukar.", data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in tukar-point route:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
