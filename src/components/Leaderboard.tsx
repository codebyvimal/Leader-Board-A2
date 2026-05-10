"use client";

import { User } from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Flame, Crown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  users: User[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  return (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase font-orbitron">Rankings</h2>
          <span className="text-[10px] text-[var(--text-soft)] font-bold mt-1 uppercase tracking-widest">Global Protocol V1</span>
        </div>
        <div className="text-[10px] font-black text-[var(--gold)] bg-[var(--gold)]/10 px-4 py-2 border border-[var(--gold)]/20 font-orbitron uppercase tracking-widest">
          Live
        </div>
      </div>

      {/* Static list — only individual rows tilt on hover */}
      <div className="flex-1 space-y-3">
        {users.map((user, index) => (
          <StudentRow key={user.id} user={user} index={index} />
        ))}
      </div>
    </div>
  );
}

function StudentRow({ user, index }: { user: User; index: number }) {
  return (
    <div
      className="student-row"
      style={{
        transformStyle: "preserve-3d",
        perspective: "600px",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        e.currentTarget.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0px)";
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "600px",
        transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <Link
        href={`/u/${user.handle}`}
        className={cn(
          "flex items-center p-4 border border-[var(--line)] bg-[var(--bg-0)]/40 transition-colors duration-300 group relative overflow-hidden block",
          index === 0
            ? "border-[var(--gold)]/50 bg-[var(--gold)]/5"
            : "hover:border-[var(--gold)]/20 hover:bg-white/[0.04]"
        )}
      >
        {index === 0 && (
          <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--gold)] opacity-5 blur-[30px] pointer-events-none" />
        )}

        {/* Rank */}
        <div className="flex flex-col items-center justify-center w-10 mr-4 shrink-0">
          <span className={cn(
            "text-xl font-black font-orbitron leading-none",
            index === 0 ? "text-[var(--gold)]" :
            index === 1 ? "text-gray-300" :
            index === 2 ? "text-amber-700/90" : "text-gray-600"
          )}>
            {user.rank.toString().padStart(2, "0")}
          </span>
          <div className="mt-2">
            {index === 0 ? (
              <Crown className="w-4 h-4 text-yellow-500" />
            ) : user.trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            ) : user.trend === "down" ? (
              <TrendingDown className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            )}
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="flex-1 flex items-center min-w-0">
          <div className="w-11 h-11 bg-gradient-to-br from-[var(--bg-0)] to-[var(--bg-1)] flex items-center justify-center text-sm font-black border border-[var(--line)] mr-4 group-hover:border-[var(--gold)]/40 transition-colors shrink-0 overflow-hidden relative shadow-lg">
            <span className="relative z-10">{user.avatar}</span>
            <div className="absolute inset-0 bg-[var(--gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-bold text-white text-[15px] truncate group-hover:text-[var(--gold)] transition-colors flex items-center gap-2">
              {user.name}
              {index === 0 && <ShieldCheck className="w-3.5 h-3.5 text-[var(--gold)]" />}
            </h3>
            <div className="flex items-center text-[11px] text-[var(--text-soft)] mt-1.5 font-bold uppercase tracking-wider">
              <span className="text-[var(--gold)] mr-3">{user.xp.toLocaleString()} XP</span>
              <div className="flex items-center text-amber-600/90 bg-amber-700/10 px-1.5 py-0.5 border border-amber-700/20">
                <Flame className="w-3 h-3 mr-1 fill-amber-700/20" />
                {user.streak}
              </div>
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90 p-1" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--line)"
              strokeWidth="3.5"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="3.5"
              strokeDasharray={`${user.progress}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[10px] font-black text-white font-orbitron group-hover:text-[var(--gold)] transition-colors">
            {user.progress}%
          </span>
        </div>
      </Link>
    </div>
  );
}
