import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionToken = searchParams.get("token");
    const deviceId = searchParams.get("device");

    if (!sessionToken || !deviceId) {
      return NextResponse.json(
        { error: "Missing token or device parameter" },
        { status: 400 }
      );
    }

    // Get session from database
    const { data: session, error } = await supabase
      .from("iot_sessions")
      .select("user_id, expires_at")
      .eq("session_token", sessionToken)
      .eq("device_id", deviceId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { error: "Session not found or expired" },
        { status: 404 }
      );
    }

    // Check if session expired
    const expiresAt = new Date(session.expires_at);
    if (expiresAt < new Date()) {
      // Delete expired session
      await supabase
        .from("iot_sessions")
        .delete()
        .eq("session_token", sessionToken);

      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
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
    });
  } catch (err: any) {
    console.error("Error in get-user API:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete session after transaction
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionToken = searchParams.get("token");

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Missing token parameter" },
        { status: 400 }
      );
    }

    await supabase
      .from("iot_sessions")
      .delete()
      .eq("session_token", sessionToken);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting session:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
