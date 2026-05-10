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
    case "task_completed":   return CheckCircle2;
    case "proof_submitted":  return ShieldCheck;
    case "streak_milestone": return Flame;
    case "rank_change":      return Award;
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
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="glass-panel progress-grid p-8 border border-[var(--line)]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />
          <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase font-orbitron">Activity Stream</h2>
        </div>
        <div className="control-surface text-[10px] font-black text-[var(--text-soft)] uppercase tracking-widest px-4 py-2">
          Last 7 Days
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
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex gap-5 p-5 border border-[var(--line)] control-surface hover:bg-white/[0.04] transition-all duration-300 group interactive-frame frame-cut"
            >
              <div
                className={cn(
                  "w-12 h-12 border flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-300 frame-cut",
                  accentForType(event.type)
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 control-surface flex items-center justify-center text-xs font-black shrink-0 group-hover:border-[var(--gold)]/30 transition-colors">
                      {event.userAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[15px] text-[var(--text-soft)] truncate">
                        <Link
                          href={`/u/${event.userId}`}
                          className="font-black text-white hover:text-[var(--gold)] transition-colors font-orbitron text-xs uppercase tracking-wider"
                        >
                          {event.userName}
                        </Link>{" "}
                        <span className="font-medium">{event.title}</span>
                      </div>
                      {event.detail && (
                        <div className="text-xs text-[var(--text-soft)] opacity-60 mt-1 font-bold uppercase tracking-wider">
                          {event.detail}
                        </div>
                      )}
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
