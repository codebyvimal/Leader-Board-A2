"use client";

import { Sidebar } from "@/components/Sidebar";
import { mockPublicProfile, mockUsers } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, MapPin, UserRound } from "lucide-react";

export default function PublicProfilePage({ params }: { params: { handle: string } }) {
  const handle = params.handle;

  // For now, resolve from mock data; later we’ll fetch from Supabase profiles.
  const user = mockUsers.find((u) => u.handle === handle || u.id === handle);
  const profile =
    handle === "vimal" || handle === "me"
      ? mockPublicProfile
      : {
          ...mockPublicProfile,
          displayName: user?.name ?? "Unknown",
          handle: user?.handle ?? handle,
          avatarInitials: user?.avatar ?? "U",
        };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 lg:mb-10">
            <p className="text-accent font-medium tracking-widest text-xs lg:text-sm mb-2">PUBLIC</p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Profile</h1>
            <p className="text-gray-400 mt-2 lg:mt-3 max-w-2xl text-sm lg:text-base">This is how the user appears on Leaderboard and Activity.</p>
          </header>

          <section className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold text-white border border-white/10 shadow-inner">
                {profile.avatarInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-bold text-white truncate">{profile.displayName}</div>
                <div className="text-gray-400 mt-1">@{profile.handle}</div>
                <div className="text-gray-200 mt-4">{profile.headline}</div>
              </div>
              <div className="text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-xl px-4 py-3 inline-flex items-center gap-2">
                <UserRound className="w-4 h-4" />
                Public profile
              </div>
            </div>

            <div className="mt-6 text-gray-300 leading-relaxed max-w-3xl">
              {profile.bio}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-400">
              {profile.location && (
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4" />
                  {profile.location}
                </div>
              )}
              {profile.website && (
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <LinkIcon className="w-4 h-4" />
                  <span className={cn("truncate max-w-[260px]")}>{profile.website}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

