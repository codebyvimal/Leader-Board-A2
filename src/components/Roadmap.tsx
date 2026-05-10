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
      case "completed":   return <CheckCircle2 className="w-5 h-5 text-[var(--gold)]" />;
      case "in-progress": return <Zap className="w-4.5 h-4.5 text-[var(--gold)]" />;
      case "upcoming":    return <Circle className="w-5 h-5 text-[var(--text-soft)]" />;
      case "locked":      return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusClasses = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "panel-inset opacity-95";
      case "in-progress":
        return "panel-inset scale-[1.02] z-20 ring-1 ring-[var(--gold)]/20";
      case "upcoming":
        return "control-surface hover:bg-white/[0.05] cursor-pointer hover:border-[var(--gold)]/30";
      case "locked":
        return "control-surface opacity-40 cursor-not-allowed grayscale";
    }
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: sectionIndex * 0.15 }}
        >
          {/* Section header */}
          <div className="flex items-center mb-6 group">
            <div className="w-[2px] h-7 bg-gradient-to-b from-[var(--gold)] to-[var(--gold-muted)] mr-4" />
            <h2 className="text-xl xl:text-2xl font-black text-white tracking-[0.12em] mr-5 font-orbitron uppercase group-hover:text-[var(--gold)] transition-colors">
              {section.title}
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--line)] to-transparent" />
          </div>

          <div className="space-y-4 relative pl-3 progress-grid">
            {/* Vertical timeline line */}
            <div className="absolute left-[29px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[var(--line)] via-[var(--line)] to-transparent z-0" />

            {section.tasks.map((task, taskIndex) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: taskIndex * 0.1 }}
                whileHover={task.status !== "locked" ? { x: 4 } : {}}
                onClick={() => task.status !== "locked" && onTaskClick(task)}
                className={cn(
                  "relative z-10 p-4 sm:p-5 xl:p-6 border backdrop-blur-xl transition-all duration-300 ml-10 sm:ml-14 glass-panel interactive-frame roadmap-timeline-task",
                  getStatusClasses(task.status)
                )}
              >
                {/* Timeline node */}
                <div className="absolute -left-[33px] sm:-left-[45px] top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center control-surface border z-20 roadmap-timeline-node">
                  {getStatusIcon(task.status)}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div>
                    <h3 className={cn(
                      "text-lg xl:text-[1.15rem] font-bold tracking-tight mb-1.5 font-orbitron",
                      task.status === "locked" ? "text-gray-600" : "text-white"
                    )}>
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[var(--gold)] font-black text-[11px] uppercase tracking-[0.18em] flex items-center gap-1.5">
                        <Zap className="w-3 h-3 fill-current" />
                        {task.xp} XP
                      </span>
                      <span className="text-[var(--text-soft)] text-[11px] font-bold flex items-center uppercase tracking-wider">
                        <Clock className="w-3 h-3 mr-1.5 opacity-70" />
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

                <p className="text-[14px] text-[var(--text-soft)] leading-relaxed max-w-2xl font-medium">
                  {task.description}
                </p>

                {task.status === "in-progress" && (
                  <div className="mt-5 pt-5 border-t border-[var(--line)] flex justify-end">
                    <button
                      className="text-[11px] font-black uppercase tracking-[0.18em] hud-chip text-[var(--gold)] hover:bg-[var(--gold)]/20 px-5 py-2.5 transition-all flex items-center gap-2.5"
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
