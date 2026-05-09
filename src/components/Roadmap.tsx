"use client";

import { motion } from "framer-motion";
import { Section, Task } from "@/lib/data";
import { CheckCircle2, Circle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapProps {
  sections: Section[];
  onTaskClick: (task: Task) => void;
}

export function Roadmap({ sections, onTaskClick }: RoadmapProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-accent" />;
      case 'in-progress': return <Circle className="w-5 h-5 text-amber-400 fill-amber-400/20" />;
      case 'upcoming': return <Circle className="w-5 h-5 text-gray-400" />;
      case 'locked': return <Lock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusClasses = (status: Task['status']) => {
    switch (status) {
      case 'completed': return "border-accent/30 bg-accent/5";
      case 'in-progress': return "border-amber-500/30 bg-amber-500/5 ring-1 ring-amber-500/20";
      case 'upcoming': return "border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 cursor-pointer";
      case 'locked': return "border-white/5 bg-transparent opacity-60 cursor-not-allowed";
    }
  };

  return (
    <div className="max-w-3xl space-y-12 pb-20">
      {sections.map((section, sectionIndex) => (
        <motion.div 
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: sectionIndex * 0.2 }}
        >
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide mr-4">{section.title}</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="space-y-4 relative">
            <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-border z-0" />
            
            {section.tasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={task.status !== 'locked' ? { scale: 1.01, x: 5 } : {}}
                onClick={() => task.status !== 'locked' && onTaskClick(task)}
                className={cn(
                  "relative z-10 p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 ml-12",
                  getStatusClasses(task.status)
                )}
              >
                {/* Node on the line */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background rounded-full">
                  {getStatusIcon(task.status)}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className={cn("text-lg font-semibold", task.status === 'locked' ? "text-gray-500" : "text-gray-200")}>
                    {task.title}
                  </h3>
                  <div className="flex items-center space-x-3 text-xs font-medium">
                    <span className="text-accent">{task.xp} XP</span>
                    <span className="text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                  {task.description}
                </p>

                {task.status === 'in-progress' && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <button 
                      className="text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 px-4 py-2 rounded-lg transition-colors border border-accent/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      Submit Proof
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
