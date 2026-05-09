"use client";

import { motion } from "framer-motion";
import { ActivityEvent } from "@/lib/data";
import Link from "next/link";
import { Award, CheckCircle2, Flame, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

function iconForType(type: ActivityEvent["type"]) {
  switch (type) {
    case "task_completed":
      return CheckCircle2;
    case "proof_submitted":
      return ShieldCheck;
    case "streak_milestone":
      return Flame;
    case "rank_change":
      return Award;
  }
}

function accentForType(type: ActivityEvent["type"]) {
  switch (type) {
    case "task_completed":
      return "text-[var(--electric-blue)] bg-[var(--electric-blue)]/10 border-[var(--electric-blue)]/20 shadow-[0_0_15px_var(--glow-blue)]";
    case "proof_submitted":
      return "text-[var(--neon-purple)] bg-[var(--neon-purple)]/10 border-[var(--neon-purple)]/20 shadow-[0_0_15px_var(--glow-purple)]";
    case "streak_milestone":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.2)]";
    case "rank_change":
      return "text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]";
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 glow-border">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-[var(--electric-blue)] fill-[var(--electric-blue)]" />
          <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase font-orbitron">Protocol Stream</h2>
        </div>
        <div className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-[var(--line)]">
          Sync Cycle: 7 Days
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = iconForType(event.type);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex gap-5 p-5 rounded-2xl border border-[var(--line)] bg-[var(--bg-0)]/40 hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--electric-blue)] opacity-0 group-hover:opacity-[0.03] blur-[40px] pointer-events-none transition-opacity" />
              
              <div
                className={cn(
                  "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500",
                  accentForType(event.type)
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bg-0)] to-[var(--bg-1)] flex items-center justify-center text-xs font-black border border-[var(--line)] shadow-lg shrink-0 group-hover:border-[var(--electric-blue)] transition-colors">
                      {event.userAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] text-[var(--text-soft)] truncate">
                        <Link
                          href={`/u/${event.userId}`}
                          className="font-black text-white hover:text-[var(--electric-blue)] transition-colors font-orbitron text-xs uppercase tracking-wider"
                        >
                          {event.userName}
                        </Link>{" "}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {event.detail && <div className="text-xs text-[var(--text-soft)] opacity-60 mt-1.5 font-bold uppercase tracking-wider leading-relaxed">{event.detail}</div>}
                    </div>
                  </div>

                  <div className="text-[10px] font-black text-[var(--text-soft)] opacity-40 uppercase tracking-widest whitespace-nowrap sm:text-right">
                    {new Date(event.timestamp).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

