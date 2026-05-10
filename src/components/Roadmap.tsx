"use client";

import { motion } from "framer-motion";
import { Section, Task } from "@/lib/data";
import { CheckCircle2, Circle, Clock, Lock, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapProps {
  sections: Section[];
  onTaskClick: (task: Task) => void;
}

export function Roadmap({ sections, onTaskClick }: RoadmapProps) {
  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "completed":   return <CheckCircle2 className="w-6 h-6 text-[var(--gold)]" />;
      case "in-progress": return <Zap className="w-5 h-5 text-amber-500 animate-pulse" />;
      case "upcoming":    return <Circle className="w-5 h-5 text-[var(--text-soft)]" />;
      case "locked":      return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusClasses = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "border-[var(--gold)]/30 bg-[var(--gold)]/5 opacity-90";
      case "in-progress":
        return "border-amber-700/40 bg-amber-900/10 scale-[1.02] z-20 ring-1 ring-amber-700/20";
      case "upcoming":
        return "border-[var(--line)] bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer hover:border-[var(--gold)]/30";
      case "locked":
        return "border-[var(--line)] bg-transparent opacity-40 cursor-not-allowed grayscale";
    }
  };

  return (
    <div className="max-w-4xl space-y-16 pb-24">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: sectionIndex * 0.15 }}
        >
          {/* Section header */}
          <div className="flex items-center mb-8 group">
            <div className="w-[3px] h-8 bg-gradient-to-b from-[var(--gold)] to-[var(--gold-muted)] mr-5 shadow-[0_0_12px_var(--glow-gold)]" />
            <h2 className="text-2xl xl:text-3xl font-black text-white tracking-widest mr-6 font-orbitron uppercase group-hover:text-[var(--gold)] transition-colors">
              {section.title}
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--line)] to-transparent" />
          </div>

          <div className="space-y-6 relative pl-4">
            {/* Vertical timeline line */}
            <div className="absolute left-[34px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[var(--line)] via-[var(--line)] to-transparent z-0" />

            {section.tasks.map((task, taskIndex) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: taskIndex * 0.1 }}
                whileHover={task.status !== "locked" ? { x: 8 } : {}}
                onClick={() => task.status !== "locked" && onTaskClick(task)}
                className={cn(
                  "relative z-10 p-6 xl:p-8 border backdrop-blur-xl transition-all duration-500 ml-16 glass-panel",
                  getStatusClasses(task.status)
                )}
              >
                {/* Timeline node */}
                <div className="absolute -left-[54px] top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-[var(--bg-0)] border-2 border-[var(--line)] shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20">
                  {getStatusIcon(task.status)}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className={cn(
                      "text-xl font-bold tracking-tight mb-2 font-orbitron",
                      task.status === "locked" ? "text-gray-600" : "text-white"
                    )}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <span className="text-[var(--gold)] font-black text-xs uppercase tracking-widest flex items-center gap-1.5">
                        <Zap className="w-3 h-3 fill-current" />
                        {task.xp} XP
                      </span>
                      <span className="text-[var(--text-soft)] text-xs font-bold flex items-center uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 mr-2 opacity-70" />
                        Due {new Date(task.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  </div>

                  {task.status !== "locked" && (
                    <div className="hidden sm:flex items-center text-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black uppercase tracking-widest mr-2">Open</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-[15px] text-[var(--text-soft)] leading-relaxed max-w-2xl font-medium">
                  {task.description}
                </p>

                {task.status === "in-progress" && (
                  <div className="mt-6 pt-6 border-t border-[var(--line)] flex justify-end">
                    <button
                      className="text-xs font-black uppercase tracking-[0.2em] bg-[var(--gold)]/10 text-[var(--gold)] hover:bg-[var(--gold)]/20 px-6 py-3 transition-all border border-[var(--gold)]/30 flex items-center gap-3"
                      onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                    >
                      Submit Proof
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
