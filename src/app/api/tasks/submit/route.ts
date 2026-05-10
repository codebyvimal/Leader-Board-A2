import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const { taskId, proofUrl } = await request.json();

    if (!taskId || !proofUrl) {
      return NextResponse.json({ error: "Missing taskId or proofUrl" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 1. Get the XP reward from the roadmap_nodes table
    const { data: nodeData, error: nodeError } = await supabaseAdmin
      .from("roadmap_nodes")
      .select("title, xp_reward")
      .eq("id", taskId)
      .single();

    if (nodeError || !nodeData) {
      return NextResponse.json({ error: "Roadmap node not found" }, { status: 404 });
    }

    const xpReward = nodeData.xp_reward || 0;

    // 2. Insert into roadmap_completions to prevent duplicate submissions
    const { error: completionError } = await supabaseAdmin
      .from("roadmap_completions")
      .insert({
        node_id: taskId,
        user_id: user.id,
        proof_url: proofUrl,
        awarded_xp: xpReward
      });

    if (completionError) {
      // If error is unique constraint violation, they already completed it
      if (completionError.code === '23505') {
        return NextResponse.json({ error: "You have already completed this node" }, { status: 400 });
      }
      throw completionError;
    }

    // 3. Grant XP to the user in the profiles table (increment by xpReward)
    // First fetch current XP
    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("xp, display_name, username")
      .eq("id", user.id)
      .single();

    const currentXp = profileData?.xp || 0;
    const newXp = currentXp + xpReward;

    await supabaseAdmin
      .from("profiles")
      .update({ xp: newXp })
      .eq("id", user.id);

    // 4. Log the activity in the Live Feed
    await supabaseAdmin
      .from("activity")
      .insert({
        user_id: user.id,
        action_type: 'proof_submitted',
        title: `Completed: ${nodeData.title}`,
        detail: `Earned +${xpReward} XP. Proof attached.`
      });

    return NextResponse.json({ 
      success: true, 
      message: "Proof submitted successfully! XP Awarded.",
      awardedXp: xpReward,
      newTotalXp: newXp
    });

  } catch (error: any) {
    console.error("Task Submit Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
