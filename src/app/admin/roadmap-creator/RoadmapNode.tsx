"use client";

import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Zap, Clock, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/lib/data";

interface RoadmapNodeData {
  title: string;
  description: string;
  xp: number;
  deadline: string;
  status: TaskStatus;
  difficulty?: "Easy" | "Medium" | "Hard" | "Elite";
  color?: string;
}

const RoadmapNode = memo(({ data, selected }: { data: RoadmapNodeData; selected: boolean }) => {
  const getStatusColor = () => {
    switch (data.status) {
      case "completed": return "border-[var(--gold)]/80 bg-[var(--gold)]/10";
      case "in-progress": return "border-[var(--gold-muted)] bg-[var(--gold)]/5";
      case "upcoming": return "border-[var(--line)] bg-[var(--bg-1)]/80";
      case "locked": return "border-[var(--line)] bg-[var(--bg-0)]/90 opacity-60";
      default: return "border-[var(--line)] bg-[var(--bg-1)]/80";
    }
  };

  const StatusIcon = () => {
    switch (data.status) {
      case "completed": return <ShieldCheck className="w-4 h-4 text-[var(--gold)]" />;
      case "in-progress": return <Zap className="w-4 h-4 text-[var(--gold-muted)] animate-pulse" />;
      case "upcoming": return <AlertCircle className="w-4 h-4 text-[var(--text-soft)]" />;
      case "locked": return <Lock className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-[var(--text-soft)]" />;
    }
  };

  const customColor = data.color as string | undefined;

  return (
    <div
      className={cn(
        "glass-panel p-4 min-w-[280px] backdrop-blur-xl transition-all shadow-xl group",
        !customColor && getStatusColor(),
        selected && !customColor ? "ring-2 ring-[var(--gold)] shadow-[0_0_20px_var(--glow-gold)] scale-[1.02]" : "hover:border-[var(--gold)]/30",
        selected && customColor ? "scale-[1.02] shadow-[0_0_20px_rgba(0,0,0,0.5)]" : ""
      )}
      style={customColor ? {
        borderColor: customColor,
        backgroundColor: `${customColor}1A`, // 10% opacity
        boxShadow: selected ? `0 0 20px ${customColor}80` : undefined,
        outline: selected ? `2px solid ${customColor}` : undefined
      } : undefined}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[var(--bg-0)] border-2 border-[var(--line)] !rounded-none transition-colors" style={customColor ? { borderColor: customColor } : {}} />
      
      <div className="flex items-start justify-between mb-3 gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-base font-black font-orbitron tracking-wide truncate",
            data.status === "locked" ? "text-gray-500" : "text-white"
          )}>
            {data.title}
          </h3>
          {data.difficulty && (
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 border mt-1 inline-block",
              data.difficulty === "Elite" ? "text-[#f48787] border-[#f48787]/30 bg-[#f48787]/10" :
              data.difficulty === "Hard" ? "text-amber-400 border-amber-400/30 bg-amber-400/10" :
              "text-[var(--gold)] border-[var(--gold)]/30 bg-[var(--gold)]/10"
            )}>
              {data.difficulty}
            </span>
          )}
        </div>
        <div className="shrink-0 control-surface p-1.5 border border-[var(--line)]">
          <StatusIcon />
        </div>
      </div>

      <p className="text-xs text-[var(--text-soft)] font-medium leading-relaxed line-clamp-3 mb-4">
        {data.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]/50">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest" style={customColor ? { color: customColor } : { color: 'var(--gold)' }}>
          <Zap className="w-3 h-3" style={customColor ? { fill: customColor } : { fill: 'var(--gold)' }} />
          {data.xp} XP
        </div>
        {data.deadline && (
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-[var(--text-soft)] uppercase tracking-wider">
            <Clock className="w-3 h-3 opacity-70" />
            {new Date(data.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[var(--bg-0)] border-2 border-[var(--line)] !rounded-none transition-colors" style={customColor ? { borderColor: customColor } : {}} />
    </div>
  );
});

RoadmapNode.displayName = "RoadmapNode";

export default RoadmapNode;
