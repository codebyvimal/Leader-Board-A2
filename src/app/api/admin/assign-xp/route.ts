import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { studentId, taskTitle, xpAmount } = await req.json();

    if (!studentId || !taskTitle || typeof xpAmount !== "number") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (xpAmount < 10 || xpAmount > 30) {
      return NextResponse.json({ error: "XP must be between 10 and 30" }, { status: 400 });
    }

    // Initialize Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Server configuration missing." }, { status: 500 });
    }

    const adminAuthClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 1. Get the admin making the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No auth header" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    
    const { data: { user }, error: authError } = await adminAuthClient.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Check if this user is ramadass or vimal
    const { data: adminProfile } = await adminAuthClient
      .from("profiles")
      .select("handle")
      .eq("id", user.id)
      .single();

    if (!adminProfile || (adminProfile.handle !== "ramadass" && adminProfile.handle !== "vimal")) {
      return NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 });
    }

    // 3. Fetch current student XP
    const { data: student, error: studentError } = await adminAuthClient
      .from("profiles")
      .select("xp")
      .eq("id", studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // 4. Update Student XP
    const newXp = (student.xp || 0) + xpAmount;
    const { error: updateError } = await adminAuthClient
      .from("profiles")
      .update({ xp: newXp })
      .eq("id", studentId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update XP" }, { status: 500 });
    }

    // 5. Insert Activity Event
    await adminAuthClient.from("activity").insert({
      user_id: studentId,
      action_type: "xp_awarded",
      title: "Task Assigned & Verified",
      detail: taskTitle,
      xp_earned: xpAmount,
    });

    return NextResponse.json({ success: true, newXp });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
