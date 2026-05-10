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
      <main className="flex-1 lg:ml-52 p-4 pt-16 lg:pt-7 lg:pl-2 lg:pr-5 xl:pr-6 w-full overflow-x-hidden relative z-10">
        <div className="w-full max-w-[1180px] mr-auto pb-24 lg:pb-20 progress-grid">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5 mb-10 xl:mb-14 pt-4 xl:pt-8">
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
            <div className="flex items-center gap-4 glass-panel p-4">
              <div className="w-11 h-11 hud-chip flex items-center justify-center shrink-0">
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
