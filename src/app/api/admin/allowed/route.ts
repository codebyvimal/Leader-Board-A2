import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  const normalized = (email ?? "").trim().toLowerCase();

  if (!normalized) {
    return NextResponse.json({ allowed: false }, { status: 200 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Don’t allow admin actions when backend isn’t configured.
    return NextResponse.json({ allowed: false, error: "Supabase not configured" }, { status: 200 });
  }

  // Requires a table like: admin_emails(email text primary key)
  const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/admin_emails`);
  url.searchParams.set("select", "email");
  url.searchParams.set("email", `eq.${normalized}`);
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ allowed: false }, { status: 200 });
  }

  const data = (await res.json().catch(() => [])) as Array<{ email: string }>;
  return NextResponse.json({ allowed: data.length > 0 }, { status: 200 });
}

