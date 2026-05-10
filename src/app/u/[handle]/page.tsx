"use client";

import { use, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { PublicProfile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, MapPin, UserRound, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = use(params);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", handle)
        .single();

      if (data) {
        setProfile({
          id: data.id,
          displayName: data.display_name || data.username,
          handle: data.username,
          headline: data.headline || "",
          bio: data.bio || "",
          location: data.location || "",
          website: data.website || "",
          avatarInitials: (data.display_name || data.username).substring(0, 2).toUpperCase(),
          avatarUrl: data.avatar_url,
          coverUrl: data.cover_url,
          xp: data.xp || 0,
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, [handle]);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />

      <main className="dashboard-main lg:pt-7">
        <div className="dashboard-content max-w-[1000px] pt-4 xl:pt-10">

          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-2 text-[var(--text-soft)] control-surface px-5 py-3 font-orbitron font-black uppercase tracking-widest text-xs mb-10 hover:bg-[var(--gold)]/10 hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Leaderboard
          </Link>

          <header className="mb-10 lg:mb-14">
            <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] lg:text-xs mb-3 uppercase flex items-center gap-2">
              <UserRound className="w-4 h-4" />
              Public Profile
            </p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
              Operator File
            </h1>
            <p className="text-[var(--text-soft)] mt-4 max-w-2xl text-sm lg:text-[16px] font-medium leading-relaxed">
              Publicly accessible data for <span className="text-[var(--gold)]">@{handle}</span>.
            </p>
          </header>

          {loading ? (
            <div className="text-[var(--gold)] font-orbitron animate-pulse uppercase tracking-[0.3em] text-center py-20">
              Loading...
            </div>
          ) : !profile ? (
            <div className="text-[var(--text-soft)] font-orbitron uppercase tracking-widest text-center py-20">
              Operator Not Found
            </div>
          ) : (
            <section className="profile-shell overflow-hidden">
              {/* Cover */}
              <div className="relative h-40 md:h-56 bg-white/[0.02]">
                {profile.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.coverUrl}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-[var(--gold)]/5 via-white/[0.02] to-transparent" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-0)] to-transparent" />
              </div>

              {/* Body */}
              <div className="relative pt-12 md:pt-16 px-8 md:px-10 pb-12 -mt-20">
                {/* Avatar */}
                <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 border-2 border-[var(--line)] bg-[var(--bg-0)] shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center mb-6">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-3xl font-black text-[var(--gold)] font-orbitron">{profile.avatarInitials}</div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="text-3xl font-black text-white truncate font-orbitron">{profile.displayName}</div>
                    <div className="text-[var(--gold)] mt-1 text-xs uppercase tracking-[0.2em] font-black opacity-70">@{profile.handle}</div>
                    <div className="text-[16px] text-white mt-4 font-bold">{profile.headline || "No headline"}</div>
                    {profile.xp !== undefined && (
                      <div className="mt-3 text-sm font-bold text-[var(--gold)]">{profile.xp.toLocaleString()} XP</div>
                    )}
                  </div>
                  <div className="text-[10px] font-black text-[var(--gold)] hud-chip px-4 py-3 inline-flex items-center gap-2 uppercase tracking-widest">
                    <UserRound className="w-4 h-4" />
                    Public Profile
                  </div>
                </div>

                <div className="mt-8 text-[var(--text-soft)] leading-relaxed max-w-3xl text-[15px] font-medium">
                  {profile.bio || "No bio provided."}
                </div>

                <div className="mt-8 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
                  {profile.location && (
                    <div className="inline-flex items-center gap-3 control-surface px-5 py-3 text-[var(--text-soft)]">
                      <MapPin className="w-4 h-4 text-[var(--gold)]" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className={cn("inline-flex items-center gap-3 control-surface px-5 py-3 text-[var(--text-soft)]")}>
                      <LinkIcon className="w-4 h-4 text-[var(--gold)]" />
                      <span className="truncate max-w-[260px]">{profile.website}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
