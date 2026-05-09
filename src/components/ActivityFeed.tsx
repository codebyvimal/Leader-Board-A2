"use client";

import { motion } from "framer-motion";
import { ActivityEvent } from "@/lib/data";
import Link from "next/link";
import { Award, CheckCircle2, Flame, ShieldCheck } from "lucide-react";
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
      return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
    case "proof_submitted":
      return "text-accent bg-accent/10 border-accent/20";
    case "streak_milestone":
      return "text-orange-300 bg-orange-500/10 border-orange-500/20";
    case "rank_change":
      return "text-sky-300 bg-sky-500/10 border-sky-500/20";
  }
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-white tracking-wide">Activity</h2>
        <div className="text-xs font-medium text-gray-400">Last 7 days</div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const Icon = iconForType(event.type);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
                  accentForType(event.type)
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10 shadow-inner">
                      {event.userAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-gray-200 truncate">
                        <Link
                          href={`/u/${event.userId}`}
                          className="font-semibold text-white hover:text-accent transition-colors"
                        >
                          {event.userName}
                        </Link>{" "}
                        <span className="text-gray-300">{event.title}</span>
                      </div>
                      {event.detail && <div className="text-xs text-gray-500 mt-1">{event.detail}</div>}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 shrink-0">
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

