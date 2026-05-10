"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Leaderboard } from "@/components/Leaderboard";
import { PublicProfile, User, getLeaderboard, getCurrentProfile } from "@/lib/data";
import { Trophy, Star } from "lucide-react";

function StatRing(props: { label: string; value: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const dash = (props.value / 100) * c;
  return (
    <div className="flex flex-col items-center w-full gap-5">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="5" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="5"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 8px var(--glow-gold))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-white font-orbitron">
          {props.value}%
        </div>
      </div>
      {props.label && <span className="text-[9px] text-[var(--text-soft)] font-black tracking-[0.3em] uppercase text-center">{props.label}</span>}
    </div>
  );
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    getLeaderboard().then(setUsers);
    getCurrentProfile().then((p) => {
      if (p) {
        setProfile(p);
        setCurrentUserId(p.id);
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-52 p-4 pt-20 lg:pt-7 lg:pl-2 lg:pr-5 xl:pr-6 w-full overflow-x-hidden relative z-10">
        <div className="w-full max-w-[1180px] mr-auto pb-24 lg:pb-20 pt-4 xl:pt-10 progress-grid">
          <header className="mb-10">
            <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] mb-3 uppercase flex items-center gap-2">
              <Trophy className="w-4 h-4 fill-[var(--gold)]" />
              Elite Rankings
            </p>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
              Leaderboard
            </h1>
            <p className="text-[var(--text-soft)] mt-3 max-w-2xl text-sm lg:text-[15px] font-medium leading-relaxed">
              Real-time synchronization of the network.
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Leaderboard users={users} currentUserId={currentUserId} />
            </div>
            <div className="space-y-5">
              <div className="glass-panel p-6 border border-[var(--line)]">
                <StatRing label="LEVEL PROGRESS" value={profile ? ((profile.xp || 0) % 1000) / 10 : 0} />
              </div>
              <div className="glass-panel p-5 border border-[var(--line)]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 hud-chip flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="text-[13px] font-bold text-white mb-1 font-orbitron uppercase tracking-wide">Next Milestone</div>
                    <div className="text-[12px] text-[var(--text-soft)] leading-relaxed">
                      Complete more missions to unlock <span className="text-[var(--gold)] font-bold">New Operator Tiers</span>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
