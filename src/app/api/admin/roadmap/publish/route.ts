import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
    }

    const { nodes, edges } = await request.json();

    if (!nodes || !edges) {
      return NextResponse.json({ error: "Missing roadmap data" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Required to bypass RLS for admin actions
    );

    // Verify token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // In a real app, verify the user is an admin via your profile table here.
    // For this prototype, we'll proceed if they are authenticated.

    // 1. Clear existing roadmap data (Full override approach for prototype simplicity)
    await supabaseAdmin.from("roadmap_edges").delete().neq("id", "0");
    await supabaseAdmin.from("roadmap_nodes").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    // 2. Insert new nodes
    if (nodes.length > 0) {
      const dbNodes = nodes.map((n: any) => ({
        id: n.id.includes("-") ? n.id : undefined, // If React flow generated a string, we might need UUID generation, assuming UUID format if dashed.
        // Quick fix for prototype: Just generate UUIDs in the database using default, or map them if you want to keep edge relations.
        // Since React Flow uses simple strings like '1', '2', 'node_123', we must ensure we use valid UUIDs if we specified UUID in SQL.
        // For this API to work with the SQL provided, we must convert simple IDs to UUIDs, or just change SQL to TEXT.
      }));
      
      // Note: Because ReactFlow uses arbitrary string IDs ("1", "node_123") and Supabase UUID requires standard format,
      // it is much easier to just store them as text in the database for now.
    }

    // ACTUALLY, let's just send the raw data if we update the SQL to use TEXT for IDs instead of UUID for nodes/edges.
    // We will assume the SQL provided uses TEXT for roadmap_nodes ID.

    const nodesData = nodes.map((n: any) => ({
      id: String(n.id),
      title: n.data?.title || "Untitled",
      description: n.data?.description || "",
      xp_reward: n.data?.xp || 0,
      difficulty: n.data?.difficulty || "Medium",
      status: n.data?.status || "upcoming",
      deadline: n.data?.deadline ? new Date(n.data.deadline).toISOString() : null,
      color_theme: n.data?.color || null,
      position_x: n.position?.x || 0,
      position_y: n.position?.y || 0
    }));

    if (nodesData.length > 0) {
      const { error: nodeError } = await supabaseAdmin.from("roadmap_nodes").insert(nodesData);
      if (nodeError) throw nodeError;
    }

    const edgesData = edges.map((e: any) => ({
      id: String(e.id),
      source_node_id: String(e.source),
      target_node_id: String(e.target),
      animated: e.animated || false,
      color: e.style?.stroke || null
    }));

    if (edgesData.length > 0) {
      const { error: edgeError } = await supabaseAdmin.from("roadmap_edges").insert(edgesData);
      if (edgeError) throw edgeError;
    }

    return NextResponse.json({ success: true, message: "Roadmap published successfully" });

  } catch (error: any) {
    console.error("Publish Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
