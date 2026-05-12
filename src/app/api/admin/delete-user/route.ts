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
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID diperlukan" },
        { status: 400 }
      );
    }

    // Delete related data first (transactions, iot_sessions, device_activity)
    // Delete transactions
    const { error: transError } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", userId);

    if (transError) console.warn("Warning deleting transactions:", transError);

    // Delete IoT sessions
    const { error: sessionError } = await supabase
      .from("iot_sessions")
      .delete()
      .eq("user_id", userId);

    if (sessionError) console.warn("Warning deleting iot_sessions:", sessionError);

    // Delete IoT devices
    const { error: devError } = await supabase
      .from("iot_devices")
      .delete()
      .eq("user_id", userId);

    if (devError) console.warn("Warning deleting iot_devices:", devError);

    // Delete from device_activity
    const { error: actError } = await supabase
      .from("device_activity")
      .delete()
      .eq("user_id", userId);

    if (actError) console.warn("Warning deleting device_activity:", actError);

    // Delete profile
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("Error deleting profile:", profileError);
      // Continue anyway, try to delete auth user
    }

    // Delete from auth.users using admin API
    const { data, error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting auth user:", deleteError);
      return NextResponse.json(
        { error: `Gagal menghapus user dari auth: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User berhasil dihapus", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus user" },
      { status: 500 }
    );
  }
}
