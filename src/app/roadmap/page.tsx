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
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden relative z-10">
        <div className="max-w-[1200px] mx-auto pb-20">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-12 xl:mb-16 pt-4 xl:pt-10">
            <div>
              <p className="text-[var(--gold)] font-black tracking-[0.3em] text-[10px] mb-4 uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 fill-[var(--gold)]" />
                Elite Protocol
              </p>
              <h1 className="text-4xl xl:text-6xl font-black tracking-tight mb-5 leading-none text-gradient font-orbitron uppercase">
                Roadmap
              </h1>
              <p className="text-[var(--text-soft)] text-sm xl:text-[18px] font-medium max-w-2xl leading-relaxed">
                The definitive path to mastery. Complete protocols and verify results.
              </p>
            </div>
            <div className="flex items-center gap-6 glass-panel p-5" style={{ borderRadius: 0 }}>
              <div className="w-14 h-14 bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center shrink-0">
                <span className="text-[var(--gold)] font-black text-lg font-orbitron">XP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl xl:text-4xl font-black text-white leading-none font-orbitron">{xp}</span>
                <span className="text-[11px] text-[var(--text-soft)] uppercase tracking-[0.2em] mt-2 font-black">Network XP</span>
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