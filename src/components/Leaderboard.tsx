"use client";

import { motion } from "framer-motion";
import { User } from "@/lib/data";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Flame, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  users: User[];
}

export function Leaderboard({ users }: LeaderboardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white tracking-wide">Elite Rankings</h2>
        <div className="text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          Season 1
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <Link
              href={`/u/${user.handle}`}
              className={cn(
                "flex items-center p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-300 hover:bg-white/10 group",
                index === 0 ? "border-accent/30 bg-accent/5 shadow-[0_0_15px_rgba(124,58,237,0.1)]" : ""
              )}
            >
            <div className="flex flex-col items-center justify-center w-8 mr-4">
              <span className={cn(
                "text-lg font-bold",
                index === 0 ? "text-accent text-glow" : 
                index === 1 ? "text-gray-300" : 
                index === 2 ? "text-amber-600/80" : "text-gray-500"
              )}>
                #{user.rank}
              </span>
              {index <= 2 && (
                <Crown
                  className={cn(
                    "w-3.5 h-3.5 mt-1",
                    index === 0
                      ? "text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.35)]"
                      : index === 1
                        ? "text-gray-200 drop-shadow-[0_0_10px_rgba(229,231,235,0.25)]"
                        : "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.25)]"
                  )}
                />
              )}
              {user.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400 mt-1" />}
              {user.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-400 mt-1" />}
              {user.trend === 'same' && <Minus className="w-3 h-3 text-gray-500 mt-1" />}
            </div>

            <div className="flex-1 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold border border-white/10 mr-4 shadow-inner">
                {user.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{user.name}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span className="font-medium text-accent mr-3">{user.xp.toLocaleString()} XP</span>
                  <div className="flex items-center text-orange-400/80">
                    <Flame className="w-3 h-3 mr-1" />
                    {user.streak}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="3"
                />
                <motion.path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={index === 0 ? "#7C3AED" : "rgba(124, 58, 237, 0.6)"}
                  strokeWidth="3"
                  strokeDasharray={`${user.progress}, 100`}
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${user.progress}, 100` }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute text-[10px] font-semibold text-gray-400 group-hover:text-white transition-colors">
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
