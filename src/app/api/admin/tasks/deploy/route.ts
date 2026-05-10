import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, description, xp_reward, difficulty, deadline, 
      submission_type, multiplier_1st, multiplier_2nd, multiplier_3rd, 
      target_users 
    } = body;

    if (!title || !target_users || target_users.length === 0) {
      return NextResponse.json({ error: "Missing required fields or target users" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 1. Create the advanced task
    const { data: taskData, error: taskError } = await supabaseAdmin
      .from("advanced_tasks")
      .insert({
        title,
        description,
        xp_reward: parseInt(xp_reward) || 100,
        difficulty: difficulty || 'Standard',
        deadline: deadline ? new Date(deadline).toISOString() : null,
        submission_type: submission_type || 'URL',
        multiplier_1st: parseInt(multiplier_1st) || 40,
        multiplier_2nd: parseInt(multiplier_2nd) || 30,
        multiplier_3rd: parseInt(multiplier_3rd) || 20,
        created_by: user.id
      })
      .select("id")
      .single();

    if (taskError) throw taskError;

    // 2. Assign the task to the selected users
    const assignments = target_users.map((userId: string) => ({
      task_id: taskData.id,
      user_id: userId,
      status: 'pending'
    }));

    const { error: assignError } = await supabaseAdmin
      .from("task_assignments")
      .insert(assignments);

    if (assignError) throw assignError;

    // 3. Create notifications in the activity feed
    const activities = target_users.map((userId: string) => ({
      user_id: userId,
      action_type: 'task_assigned',
      title: `Mission Assigned: ${title}`,
      detail: `You have been deployed a new task worth ${xp_reward} XP. Deadline: ${deadline ? new Date(deadline).toLocaleDateString() : 'None'}.`
    }));

    const { error: activityError } = await supabaseAdmin
      .from("activity")
      .insert(activities);

    if (activityError) {
      console.warn("Task deployed but failed to log activity:", activityError);
    }

    return NextResponse.json({ success: true, message: `Task deployed to ${target_users.length} operators.` });

  } catch (error: any) {
    console.error("Deploy Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
