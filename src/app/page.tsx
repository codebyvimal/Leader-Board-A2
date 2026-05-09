"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Roadmap } from "@/components/Roadmap";
import { Leaderboard } from "@/components/Leaderboard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ProfileSection } from "@/components/ProfileSection";
import { TaskDetailsModal } from "@/components/TaskDetailsModal";
import { Task, Section, User, ActivityEvent, getRoadmap, getLeaderboard, getActivity } from "@/lib/data";
import { Star, Zap, Trophy, Activity } from "lucide-react";

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fetch all dashboard data from Supabase
    Promise.all([getRoadmap(), getLeaderboard(), getActivity()]).then(
      async ([fetchedSections, fetchedUsers, fetchedActivity]) => {
        setSections(fetchedSections);
        setUsers(fetchedUsers);
        setActivities(fetchedActivity);
        const { getCurrentProfile } = await import("@/lib/data");
        const fetchedProfile = await getCurrentProfile();
        if (fetchedProfile) setProfile(fetchedProfile);
      }
    );
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleProofSubmit = (taskId: string, url: string) => {
    console.log(`Submitted proof for task ${taskId}: ${url}`);
  };

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden relative z-10 scroll-smooth">
        <div className="max-w-[1200px] mx-auto space-y-24 pb-20">

          
          {/* Section 1: Roadmap */}
          <section id="roadmap" className="pt-4 xl:pt-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-12 xl:mb-16">
              <div>
                <p className="text-[var(--gold)] font-black tracking-[0.3em] text-[10px] mb-4 uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-[var(--gold)]" />
                  Elite Neural Protocol
                </p>
                <h1 className="text-4xl xl:text-6xl font-black tracking-tight mb-5 leading-none text-gradient font-orbitron uppercase">
                  Roadmap
                </h1>
                <p className="text-[var(--text-soft)] text-sm xl:text-[18px] font-medium max-w-2xl leading-relaxed">
                  The definitive path to neural transcendence. Complete protocols and verify results.
                </p>
              </div>
              
              <div className="flex items-center">
                <StatChip
                  label="Network XP"
                  value={profile?.xp?.toString() || "0"}
                />
              </div>
            </div>

            <Roadmap sections={sections} onTaskClick={handleTaskClick} />
          </section>

          {/* Section 2: Leaderboard */}
          <section id="leaderboard" className="pt-20 border-t border-[var(--line)]">
            <header className="mb-12">
              <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] mb-3 uppercase flex items-center gap-2">
                <Trophy className="w-4 h-4 fill-[var(--gold)]" />
                Elite Rankings
              </p>
              <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
                Leaderboard
              </h2>
              <p className="text-[var(--text-soft)] mt-4 max-w-2xl text-sm lg:text-[16px] font-medium leading-relaxed">
                Real-time synchronization of the neural network.
              </p>
            </header>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <Leaderboard users={users} />
              </div>
              <div className="space-y-6">
                <div className="glass-panel rounded-2xl p-8 glow-border">
                  <StatRing label="LEVEL PROGRESS" value={profile ? ((profile.xp || 0) % 1000) / 10 : 0} />
                </div>
                <div className="glass-panel rounded-2xl p-8 glow-border border-[var(--line)]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center shrink-0 border border-[var(--gold)]/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                      <Star className="w-6 h-6 text-[var(--gold)]" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="text-[15px] font-bold text-white mb-1 font-orbitron uppercase tracking-wide">Next Milestone</div>
                      <div className="text-[13px] text-[var(--text-soft)] leading-relaxed">
                        Complete more missions to unlock <span className="text-[var(--gold)] font-bold">New Operator Tiers</span>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Activity */}
          <section id="activity" className="pt-20 border-t border-[var(--line)]">
            <header className="mb-12">
              <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] mb-3 uppercase flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Live Feed
              </p>
              <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
                Activity
              </h2>
              <p className="text-[var(--text-soft)] mt-4 max-w-2xl text-sm lg:text-[16px] font-medium leading-relaxed">
                Every packet of progress captured in real-time.
              </p>
            </header>
            <ActivityFeed events={activities} />
          </section>

          {/* Section 4: Profile */}
          <ProfileSection />

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
    <div className="flex items-center gap-6 glass-panel p-5 rounded-3xl glow-border">
      <div className="w-14 h-14 rounded-2xl bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/20 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(69,212,255,0.2)]">
        <span className="text-[var(--electric-blue)] font-black text-lg font-orbitron">XP</span>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl xl:text-4xl font-black text-white leading-none font-orbitron">{props.value}</span>
        <span className="text-[11px] text-[var(--text-soft)] uppercase tracking-[0.2em] mt-2 font-black">{props.label}</span>
      </div>
    </div>
  );
}

function StatRing(props: { label: string; value: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const dash = (props.value / 100) * c;
  return (
    <div className="flex flex-col items-center w-full gap-6">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--electric-blue)"
            strokeWidth="6"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 12px var(--glow-blue))" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white font-orbitron">
          {props.value}%
        </div>
      </div>
      {props.label && <span className="text-[10px] text-[var(--text-soft)] font-black tracking-[0.3em] uppercase text-center">{props.label}</span>}
    </div>
  );
}
