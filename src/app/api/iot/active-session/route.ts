import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const deviceId = searchParams.get("device");

    if (!deviceId) {
      return NextResponse.json(
        { error: "Missing device parameter" },
        { status: 400 }
      );
    }

    // Get the most recent active session for this device
    const { data: session, error } = await supabase
      .from("iot_sessions")
      .select("user_id, expires_at, session_token")
      .eq("device_id", deviceId)
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 404 }
      );
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, total_points")
      .eq("id", session.user_id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user_id: profile.id,
      full_name: profile.full_name,
      total_points: profile.total_points,
      expires_at: session.expires_at,
      session_token: session.session_token,
    });
  } catch (err: any) {
    console.error("Error in active-session API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
