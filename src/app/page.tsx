"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Roadmap } from "@/components/Roadmap";
import { Leaderboard } from "@/components/Leaderboard";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { mockActivity, mockRoadmap, mockUsers, Task } from "@/lib/data";
import { loadRoadmapFromStorage } from "@/lib/roadmapStore";
import type { Section } from "@/lib/data";
import { Star } from "lucide-react";

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections] = useState<Section[]>(() => loadRoadmapFromStorage() ?? mockRoadmap);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleProofSubmit = (taskId: string, url: string) => {
    console.log(`Submitted proof for task ${taskId}: ${url}`);
    // In a real app, this would update the backend state.
  };

  return (
    <div className="flex min-h-screen bg-background page-vignette">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col xl:flex-row gap-10 xl:gap-16">
            {/* Left Column: Roadmap */}
            <div className="flex-[2] pt-2 xl:pt-6">
              {/* Left Column Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-8 xl:mb-12">
                <div>
                  <p className="text-accent font-semibold tracking-widest text-[11px] mb-2 xl:mb-3 uppercase">SEASON 1</p>
                  <h1 className="text-3xl xl:text-[2.5rem] font-bold tracking-tight text-white mb-2 leading-none">AI Mastery Roadmap</h1>
                  <p className="text-gray-400 text-sm xl:text-[15px]">Master AI. Build the Future.</p>
                </div>
                
                <div className="flex items-center pt-0 sm:pt-2">
                  <StatChip
                    label="Total XP"
                    value="12,500"
                  />
                </div>
              </div>

              <Roadmap sections={sections} onTaskClick={handleTaskClick} />
            </div>

            {/* Right Column: Leaderboard (sticky) */}
            <div className="flex-1 w-full xl:min-w-[340px] pt-4 xl:pt-6">
              <div className="xl:sticky xl:top-8 xl:h-[calc(100vh-64px)] pb-8 overflow-y-auto scrollbar-hide">
                <div className="h-full flex flex-col gap-6 xl:gap-8">
                  
                  {/* Right Column Header */}
                  <div className="mb-2 hidden xl:block">
                    <StatRing label="Completion" value={45} />
                  </div>
                  
                  {/* Mobile Completion Ring */}
                  <div className="xl:hidden flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div>
                      <div className="text-sm font-semibold text-white">Course Completion</div>
                      <div className="text-xs text-gray-400 mt-1">Keep up the good work!</div>
                    </div>
                    <StatRing label="" value={45} />
                  </div>

                  <Leaderboard users={mockUsers} />

                  <div className="glass-card rounded-2xl p-5 xl:p-6">
                    <div className="flex items-center justify-between mb-4 xl:mb-5">
                      <h3 className="text-sm font-semibold text-white tracking-wide">RECENT ACTIVITY</h3>
                    </div>
                    <div className="space-y-4">
                      {mockActivity.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-[10px] font-bold border border-white/10 shrink-0">
                            {e.userAvatar}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-300 truncate">
                              <span className="font-semibold text-white">{e.userName}</span> {e.title}
                            </div>
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              {e.id === "1" ? "2m ago" : e.id === "2" ? "5m ago" : "12m ago"}
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-accent shrink-0">+XP</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card rounded-2xl p-5 xl:p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Star className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <div className="text-[14px] font-semibold text-white mb-1">Keep going, Vimal!</div>
                        <div className="text-[12px] text-gray-400 leading-relaxed">
                          You&apos;re 1 mission away from unlocking<br/><span className="text-accent">Neural Networks.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <TaskDetailsModal 
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleProofSubmit}
      />
    </div>
  );
}

function StatChip(props: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 xl:gap-4 bg-white/5 sm:bg-transparent border border-white/10 sm:border-none p-3 sm:p-0 rounded-2xl sm:rounded-none w-full sm:w-auto">
      <div className="w-10 h-10 xl:w-11 xl:h-11 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
        <span className="text-accent font-bold text-xs xl:text-sm">XP</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg xl:text-xl font-bold text-white leading-tight">{props.value}</span>
        <span className="text-xs xl:text-[13px] text-gray-400">{props.label}</span>
      </div>
    </div>
  );
}

function StatRing(props: { label: string; value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (props.value / 100) * c;
  return (
    <div className="flex flex-col items-center w-max gap-3">
      <div className="relative w-14 h-14 xl:w-16 xl:h-16">
        <svg className="w-14 h-14 xl:w-16 xl:h-16 -rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="4"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[12px] xl:text-[13px] font-bold text-white">
          {props.value}%
        </div>
      </div>
      {props.label && <span className="text-[12px] xl:text-[13px] text-gray-400 font-medium">{props.label}</span>}
    </div>
  );
}
