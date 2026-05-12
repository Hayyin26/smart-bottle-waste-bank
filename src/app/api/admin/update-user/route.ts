import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check if service role key is available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables!");
      console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
      console.error("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "Set" : "Missing");
      
      return NextResponse.json(
        { 
          error: "Server configuration error: Missing environment variables. Please check SUPABASE_SERVICE_ROLE_KEY in .env.local",
          details: {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!supabaseServiceKey
          }
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const body = await request.json();
    const { userId, fullName } = body;

    if (!userId || !fullName) {
      return NextResponse.json(
        { error: "User ID dan Nama Lengkap diperlukan" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { error: error.message || "Gagal memperbarui data user" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Data user berhasil diperbarui", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in update-user API:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan saat memperbarui data" },
      { status: 500 }
    );
  }
}
