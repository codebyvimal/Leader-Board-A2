"use client";

import { User } from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Flame, Crown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  users: User[];
  currentUserId?: string;
}

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <div className="glass-panel progress-grid p-4 sm:p-5 h-full flex flex-col border border-[var(--line)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex flex-col">
          <h2 className="text-xs font-black text-white tracking-[0.2em] uppercase font-orbitron">Rankings</h2>
          <span className="text-[9px] text-[var(--text-soft)] font-bold mt-0.5 uppercase tracking-widest">Global Protocol V1</span>
        </div>
        <div className="hud-chip flex items-center gap-1.5 text-[9px] font-black text-[var(--gold)] px-3 py-1.5 font-orbitron uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-[var(--gold)] dot-pulse" />
          Live
        </div>
      </div>

      {/* Compact list */}
      <div className="flex-1 space-y-1.5">
        {users.map((user, index) => (
          <StudentRow key={user.id} user={user} index={index} isYou={user.id === currentUserId} />
        ))}
      </div>
    </div>
  );
}

function StudentRow({ user, index, isYou }: { user: User; index: number; isYou: boolean }) {
  return (
    <div
      className="student-row"
      style={{
        transformStyle: "preserve-3d",
        perspective: "600px",
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        e.currentTarget.style.transform = `rotateY(${x * 4}deg) rotateX(${-y * 3}deg) translateY(-3px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0px)";
      }}
    >
      <Link
        href={`/u/${user.handle}`}
        className={cn(
          "flex items-center p-2.5 sm:p-3 border transition-all duration-300 group relative overflow-hidden interactive-frame frame-cut",
          isYou
            ? "panel-inset"
            : index === 0
              ? "panel-inset bg-[var(--gold)]/6"
              : "control-surface hover:border-[var(--gold)]/28 hover:bg-white/[0.03]"
        )}
      >
        {/* "YOU" badge */}
        {isYou && (
          <div className="absolute top-0 right-0 hud-chip text-[var(--bg-0)] text-[8px] font-black px-2 py-0.5 uppercase tracking-widest font-orbitron z-20">
            You
          </div>
        )}

        {index === 0 && (
          <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--gold)] opacity-[0.04] blur-[20px] pointer-events-none" />
        )}

        {/* Rank */}
        <div className="flex flex-col items-center justify-center w-8 mr-2.5 shrink-0">
          <span className={cn(
            "text-base font-black font-orbitron leading-none",
            index === 0 ? "text-[var(--gold)]" :
            index === 1 ? "text-gray-300" :
            index === 2 ? "text-amber-700/90" : "text-gray-600"
          )}>
            {user.rank.toString().padStart(2, "0")}
          </span>
          <div className="mt-1">
            {index === 0 ? (
              <Crown className="w-3 h-3 text-[var(--gold)]" />
            ) : user.trend === "up" ? (
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            ) : user.trend === "down" ? (
              <TrendingDown className="w-3 h-3 text-red-500" />
            ) : (
              <Minus className="w-3 h-3 text-gray-600" />
            )}
          </div>
        </div>

        {/* Avatar + Name */}
        <div className="flex-1 flex items-center min-w-0">
          <div className={cn(
            "w-8 h-8 flex items-center justify-center text-[10px] font-black border mr-2.5 shrink-0 overflow-hidden relative transition-colors",
            isYou
              ? "control-surface border-[var(--gold)]/50 shadow-[0_0_8px_var(--glow-gold)]"
              : "control-surface group-hover:border-[var(--gold)]/30"
          )}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="relative z-10 text-white bg-gradient-to-br from-[var(--bg-1)] to-[var(--bg-2)] w-full h-full flex items-center justify-center">{user.avatar}</span>
            )}
          </div>
          <div className="min-w-0 flex-1 pr-1">
            <h3 className={cn(
              "font-bold text-[13px] truncate transition-colors flex items-center gap-1.5",
              isYou ? "text-[var(--gold)]" : "text-white group-hover:text-[var(--gold)]"
            )}>
              {user.name}
              {index === 0 && <ShieldCheck className="w-3 h-3 text-[var(--gold)]" />}
            </h3>
            <div className="flex items-center text-[10px] text-[var(--text-soft)] mt-0.5 font-bold uppercase tracking-wider gap-2">
              <span className="text-[var(--gold)]">{user.xp.toLocaleString()} XP</span>
              <div className="hud-chip flex items-center text-[var(--gold-muted)] px-1.5 py-0.5">
                <Flame className="w-2.5 h-2.5 mr-0.5" />
                {user.streak}
              </div>
            </div>
          </div>
        </div>

        {/* Progress ring — compact */}
        <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90 p-0.5" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--line)"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="3"
              strokeDasharray={`${user.progress}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-[8px] font-black text-white font-orbitron group-hover:text-[var(--gold)] transition-colors">
            {user.progress}%
          </span>
        </div>
      </Link>
    </div>
  );
}
