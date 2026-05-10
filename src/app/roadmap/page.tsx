"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Roadmap } from "@/components/Roadmap";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { Task, Section, getRoadmap, getCurrentProfile } from "@/lib/data";
import { Zap } from "lucide-react";

export default function RoadmapPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [xp, setXp] = useState<number>(0);

  useEffect(() => {
    getRoadmap().then(setSections);
    getCurrentProfile().then((p) => { if (p) setXp(p.xp || 0); });
  }, []);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content progress-grid">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-7 xl:mb-8 pt-4 xl:pt-6">
            <div>
              <p className="text-[var(--gold)] font-black tracking-[0.3em] text-[10px] mb-3 uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 fill-[var(--gold)]" />
                Elite Protocol
              </p>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight mb-4 leading-none text-gradient font-orbitron uppercase">
                Roadmap
              </h1>
              <p className="text-[var(--text-soft)] text-sm xl:text-[16px] font-medium max-w-2xl leading-relaxed">
                The definitive path to mastery. Complete protocols and verify results.
              </p>
            </div>
            <div className="flex items-center gap-3 glass-panel p-3.5">
              <div className="w-10 h-10 hud-chip flex items-center justify-center shrink-0">
                <span className="text-[var(--gold)] font-black text-sm font-orbitron">XP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl xl:text-3xl font-black text-white leading-none font-orbitron">{xp}</span>
                <span className="text-[10px] text-[var(--text-soft)] uppercase tracking-[0.2em] mt-1 font-black">Network XP</span>
              </div>
            </div>
          </div>
          <Roadmap sections={sections} onTaskClick={(t) => { setSelectedTask(t); setIsModalOpen(true); }} />
        </div>
      </main>
      <TaskDetailsModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(taskId, url) => console.log(`Proof for ${taskId}: ${url}`)}
      />
    </div>
  );
}
