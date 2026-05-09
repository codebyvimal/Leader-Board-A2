"use client";

import { motion } from "framer-motion";
import { User } from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Flame, Crown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  users: User[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col glow-border">
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase font-orbitron">Neural Rankings</h2>
          <span className="text-[10px] text-[var(--text-soft)] font-bold mt-1 uppercase tracking-widest">Global Protocol V1</span>
        </div>
        <div className="text-[10px] font-black text-[var(--gold)] bg-[var(--gold)]/10 px-4 py-2 rounded-xl border border-[var(--gold)]/20 font-orbitron uppercase tracking-widest shadow-[0_0_15px_var(--glow-gold)]">
          Live
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-hide">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
          >
            <Link
              href={`/u/${user.handle}`}
              className={cn(
                "flex items-center p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-0)]/40 transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden",
                index === 0 ? "border-[var(--gold)]/40 bg-[var(--gold)]/5 shadow-[0_0_20px_var(--glow-gold)]" : "hover:border-[var(--gold)]/30 hover:bg-white/5"
              )}
            >
              {index === 0 && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--gold)] opacity-5 blur-[30px] pointer-events-none" />
              )}
              
            <div className="flex flex-col items-center justify-center w-10 mr-4 shrink-0">
              <span className={cn(
                "text-xl font-black font-orbitron leading-none",
                index === 0 ? "text-[var(--gold)] drop-shadow-[0_0_8px_var(--glow-gold)]" : 
                index === 1 ? "text-gray-300" : 
                index === 2 ? "text-amber-600/80" : "text-gray-600"
              )}>
                {user.rank.toString().padStart(2, '0')}
              </span>
              <div className="mt-2">
                {index === 0 ? (
                  <Crown className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                ) : user.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : user.trend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-gray-600" />
                )}
              </div>
            </div>

            <div className="flex-1 flex items-center min-w-0">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--bg-0)] to-[var(--bg-1)] flex items-center justify-center text-sm font-black border border-[var(--line)] mr-4 group-hover:border-[var(--gold)] transition-colors shrink-0 overflow-hidden relative shadow-lg">
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
                  <div className="flex items-center text-amber-500/90 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                    <Flame className="w-3 h-3 mr-1 fill-amber-500/20" />
                    {user.streak}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-14 h-14 relative flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90 p-1" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="3.5"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={index === 0 ? "var(--gold)" : "var(--gold-muted)"}
                  strokeWidth="3.5"
                  strokeDasharray={`${user.progress}, 100`}
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0, 100" }}
                  whileInView={{ strokeDasharray: `${user.progress}, 100` }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: index === 0 ? "drop-shadow(0 0 5px var(--glow-gold))" : "" }}
                />
              </svg>
              <span className="absolute text-[10px] font-black text-white font-orbitron group-hover:text-[var(--gold)] transition-colors">
                {user.progress}%
              </span>
            </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
