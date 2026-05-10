"use client";

import { motion } from "framer-motion";
import { ActivityEvent } from "@/lib/data";
import Link from "next/link";
import { Award, CheckCircle2, Flame, ShieldCheck, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

function iconForType(type: ActivityEvent["type"]) {
  switch (type) {
    case "task_completed":   return CheckCircle2;
    case "proof_submitted":  return ShieldCheck;
    case "streak_milestone": return Flame;
    case "rank_change":      return Award;
    case "task_assigned":    return Target;
  }
}

function accentForType(type: ActivityEvent["type"]) {
  switch (type) {
    case "task_completed":
      return "text-[var(--gold)] bg-[var(--gold)]/10 border-[var(--gold)]/20";
    case "proof_submitted":
      return "text-[var(--gold-light)] bg-[var(--gold-light)]/10 border-[var(--gold-light)]/20";
    case "streak_milestone":
      return "text-amber-600 bg-amber-700/10 border-amber-700/20";
    case "rank_change":
      return "text-[var(--text-main)] bg-white/5 border-[var(--line)]";
    case "task_assigned":
      return "text-[var(--gold)] bg-[var(--gold)]/5 border-[var(--gold)]/30 border-dashed";
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="glass-panel progress-grid p-5 md:p-6 border border-[var(--line)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
          <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase font-orbitron">Activity Stream</h2>
        </div>
        <div className="control-surface text-[10px] font-black text-[var(--text-soft)] uppercase tracking-widest px-3 py-2">
          Last 7 Days
        </div>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const Icon = iconForType(event.type);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex gap-4 p-4 md:p-4.5 border border-[var(--line)] control-surface hover:bg-white/[0.04] group interactive-frame frame-cut"
            >
              <div
                className={cn(
                  "w-10 h-10 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-300 frame-cut",
                  accentForType(event.type)
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 control-surface flex items-center justify-center text-[11px] font-black shrink-0 group-hover:border-[var(--gold)]/30 transition-colors">
                      {event.userAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] text-[var(--text-soft)] truncate">
                        <Link
                          href={`/u/${event.userId}`}
                          className="font-black text-white hover:text-[var(--gold)] transition-colors font-orbitron text-[11px] uppercase tracking-wider"
                        >
                          {event.userName}
                        </Link>{" "}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {event.detail && (
                        <div className="text-[11px] text-[var(--text-soft)] opacity-60 mt-1 font-bold uppercase tracking-wider">
                          {event.detail}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[9px] font-black text-[var(--text-soft)] opacity-45 uppercase tracking-widest whitespace-nowrap sm:text-right">
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
