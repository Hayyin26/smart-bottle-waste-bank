import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { device_id, ip_address } = await request.json();

    if (!device_id || !ip_address) {
      return NextResponse.json(
        { error: "device_id and ip_address required" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert device IP (update jika ada, insert jika belum)
    const { error } = await supabase
      .from("iot_devices")
      .upsert(
        {
          device_id,
          ip_address,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: "device_id",
        }
      );

    if (error) {
      console.error("[Register Device] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      device_id,
      ip_address,
    });
  } catch (error: any) {
    console.error("[Register Device] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const device_id = searchParams.get("device");

    if (!device_id) {
      return NextResponse.json(
        { error: "device parameter required" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("iot_devices")
      .select("*")
      .eq("device_id", device_id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Device not found" },
        { status: 404 }
      );
    }

    // Check if device is stale (not seen in last 5 minutes)
    const lastSeen = new Date(data.last_seen);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / 1000 / 60;

    return NextResponse.json({
      device_id: data.device_id,
      ip_address: data.ip_address,
      last_seen: data.last_seen,
      is_online: diffMinutes < 5,
    });
  } catch (error: any) {
    console.error("[Get Device] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
