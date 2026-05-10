"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { getLeaderboard } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  Target, Search, Filter, Users, Send, Zap, Clock, FileText, 
  Paperclip, Plus, Calendar, ShieldCheck, PieChart, BarChart
} from "lucide-react";

export default function TaskManagerPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"create" | "analytics">("create");

  // Task Form State
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [xpReward, setXpReward] = useState("500");
  const [difficulty, setDifficulty] = useState("Standard");
  const [deadline, setDeadline] = useState("");
  const [submissionType, setSubmissionType] = useState("URL / Link (e.g. GitHub, LinkedIn)");
  const [multiplier1st, setMultiplier1st] = useState("40");
  const [multiplier2nd, setMultiplier2nd] = useState("30");
  const [multiplier3rd, setMultiplier3rd] = useState("20");
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    getLeaderboard().then(setUsers);
  }, []);

  const toggleUser = (id: string) => {
    const next = new Set(selectedUsers);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedUsers(next);
  };

  const selectAll = () => {
    if (selectedUsers.size === users.length) setSelectedUsers(new Set());
    else setSelectedUsers(new Set(users.map(u => u.id)));
  };

  const handleDeploy = async () => {
    if (!taskTitle || selectedUsers.size === 0) {
      alert("Please enter a task title and select at least one operator.");
      return;
    }

    setIsDeploying(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert("Authentication required");
        setIsDeploying(false);
        return;
      }

      const res = await fetch("/api/admin/tasks/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          xp_reward: xpReward,
          difficulty,
          deadline,
          submission_type: submissionType,
          multiplier_1st: multiplier1st,
          multiplier_2nd: multiplier2nd,
          multiplier_3rd: multiplier3rd,
          target_users: Array.from(selectedUsers)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to deploy task");
      
      alert(data.message || "Task successfully deployed!");
      
      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setSelectedUsers(new Set());
      
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const inputClass = "w-full bg-[var(--bg-0)]/60 border border-[var(--line)] py-3 px-4 text-white placeholder-[var(--text-soft)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] transition-all font-medium text-sm";
  const labelClass = "block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2";

  return (
    <div className="flex min-h-screen bg-[var(--bg-0)]">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-content pt-4 xl:pt-6">
          <header className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="text-[var(--gold)] font-black tracking-widest text-xs mb-2 font-orbitron uppercase flex items-center gap-2">
                <Target className="w-4 h-4" /> Advanced Assignment
              </p>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-orbitron">Task Manager</h1>
              <p className="text-[var(--text-soft)] mt-3 max-w-2xl text-sm font-medium">
                Create multi-layered missions, deploy to specific operator cohorts, and monitor execution telemetry.
              </p>
            </div>

            <div className="flex p-1 glass-panel border border-[var(--line)]">
              <button 
                onClick={() => setActiveTab("create")}
                className={cn(
                  "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === "create" ? "bg-[var(--gold)]/10 text-[var(--gold)]" : "text-[var(--text-soft)] hover:text-white"
                )}
              >
                Create Task
              </button>
              <button 
                onClick={() => setActiveTab("analytics")}
                className={cn(
                  "px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeTab === "analytics" ? "bg-[var(--gold)]/10 text-[var(--gold)]" : "text-[var(--text-soft)] hover:text-white"
                )}
              >
                <PieChart className="w-3.5 h-3.5" /> Analytics
              </button>
            </div>
          </header>

          {activeTab === "create" && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8">
              {/* Task Configuration */}
              <div className="space-y-6">
                <div className="glass-panel p-6 border border-[var(--line)]">
                  <h2 className="text-sm font-black text-white uppercase font-orbitron tracking-widest mb-6 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--gold)]" /> Mission Parameters
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Task Title</label>
                      <input 
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="e.g. Optimize Neural Network Architecture" 
                        className={inputClass} 
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Objective Description</label>
                      <textarea 
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Detailed breakdown of the required implementation..." 
                        className={cn(inputClass, "min-h-[120px] resize-y")} 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className={labelClass}>XP Reward</label>
                        <div className="relative">
                          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" />
                          <input 
                            type="number" 
                            value={xpReward}
                            onChange={(e) => setXpReward(e.target.value)}
                            className={cn(inputClass, "pl-9")} 
                          />
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Difficulty</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputClass}>
                          <option>Standard</option>
                          <option>Hard</option>
                          <option>Elite</option>
                          <option>Master</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Deadline</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-soft)]" />
                          <input 
                            type="date" 
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className={cn(inputClass, "pl-9")} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Submission Type</label>
                        <select value={submissionType} onChange={(e) => setSubmissionType(e.target.value)} className={inputClass}>
                          <option>URL / Link (e.g. GitHub, LinkedIn)</option>
                          <option>Text / Code Snippet</option>
                          <option>File Upload</option>
                          <option>Automatic (API Verification)</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Required Milestones (Prerequisites)</label>
                        <button className="w-full bg-white/5 border border-dashed border-[var(--line)] hover:border-[var(--gold)]/50 hover:bg-[var(--gold)]/5 py-3 px-4 text-[11px] font-bold text-[var(--text-soft)] uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" /> Link Roadmap Node
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Attachments / Briefs</label>
                      <div className="border-2 border-dashed border-[var(--line)] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[var(--gold)]/40 hover:bg-[var(--gold)]/5 transition-all">
                        <div className="w-10 h-10 bg-[var(--bg-1)] border border-[var(--line)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Paperclip className="w-5 h-5 text-[var(--text-soft)] group-hover:text-[var(--gold)] transition-colors" />
                        </div>
                        <span className="text-xs font-bold text-white mb-1">Drag and drop files</span>
                        <span className="text-[10px] text-[var(--text-soft)]">PDFs, Code Snippets, Images (Max 10MB)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gamification multipliers */}
                <div className="glass-panel p-6 border border-[var(--line)]">
                  <h2 className="text-sm font-black text-white uppercase font-orbitron tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--gold)]" /> Gamification Multipliers
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 border border-[var(--line)] bg-[var(--bg-1)]/50">
                      <div className="text-[10px] font-black text-[var(--gold)] uppercase tracking-widest mb-1">1st Completion</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-black font-orbitron text-white">+</span>
                        <input value={multiplier1st} onChange={(e) => setMultiplier1st(e.target.value)} type="number" className="bg-transparent text-2xl font-black font-orbitron text-white w-12 focus:outline-none" />
                        <span className="text-2xl font-black font-orbitron text-white">% XP</span>
                      </div>
                    </div>
                    <div className="p-4 border border-[var(--line)] bg-[var(--bg-1)]/50">
                      <div className="text-[10px] font-black text-[var(--gold-muted)] uppercase tracking-widest mb-1">2nd Completion</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-black font-orbitron text-white">+</span>
                        <input value={multiplier2nd} onChange={(e) => setMultiplier2nd(e.target.value)} type="number" className="bg-transparent text-2xl font-black font-orbitron text-white w-12 focus:outline-none" />
                        <span className="text-2xl font-black font-orbitron text-white">% XP</span>
                      </div>
                    </div>
                    <div className="p-4 border border-[var(--line)] bg-[var(--bg-1)]/50">
                      <div className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-widest mb-1">3rd Completion</div>
                      <div className="flex items-center">
                        <span className="text-2xl font-black font-orbitron text-white">+</span>
                        <input value={multiplier3rd} onChange={(e) => setMultiplier3rd(e.target.value)} type="number" className="bg-transparent text-2xl font-black font-orbitron text-white w-12 focus:outline-none" />
                        <span className="text-2xl font-black font-orbitron text-white">% XP</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-soft)] mt-4 font-medium italic">
                    Dynamic multipliers encourage speed and competition among the deployed cohort.
                  </p>
                </div>
              </div>

              {/* Target Audience Sidebar */}
              <div className="space-y-4">
                <div className="glass-panel p-5 border border-[var(--line)] h-[calc(100vh-280px)] min-h-[600px] flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-black text-white uppercase font-orbitron tracking-widest flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--gold)]" /> Deploy Target
                    </h2>
                    <span className="text-[10px] font-black text-[var(--gold)] bg-[var(--gold)]/10 px-2 py-1 uppercase tracking-wider">
                      {selectedUsers.size} Selected
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-soft)]" />
                      <input 
                        placeholder="Search operators..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[var(--bg-0)]/80 border border-[var(--line)] py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[var(--gold)]/50 transition-colors" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/5 border border-[var(--line)] py-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)] hover:text-white transition-colors flex items-center justify-center gap-1.5">
                        <Filter className="w-3 h-3" /> Filter
                      </button>
                      <button onClick={selectAll} className="flex-1 bg-white/5 border border-[var(--line)] py-2 text-[9px] font-black uppercase tracking-widest text-[var(--text-soft)] hover:text-white transition-colors">
                        {selectedUsers.size === users.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                      <div 
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={cn(
                          "flex items-center gap-3 p-2.5 border cursor-pointer transition-all",
                          selectedUsers.has(user.id) 
                            ? "bg-[var(--gold)]/10 border-[var(--gold)]/30" 
                            : "bg-[var(--bg-0)] border-transparent hover:bg-white/5 hover:border-[var(--line)]"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 border flex items-center justify-center shrink-0 transition-colors",
                          selectedUsers.has(user.id) ? "border-[var(--gold)] bg-[var(--gold)]" : "border-[var(--line)] bg-[var(--bg-1)]"
                        )}>
                          {selectedUsers.has(user.id) && <ShieldCheck className="w-3 h-3 text-[var(--bg-0)]" />}
                        </div>
                        <div className="w-7 h-7 bg-[var(--bg-1)] border border-[var(--line)] flex items-center justify-center text-[8px] font-black text-white shrink-0">
                          {user.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-black text-white font-orbitron truncate">{user.name}</div>
                          <div className="text-[9px] text-[var(--text-soft)] uppercase tracking-wider font-bold">Lvl {Math.floor(user.xp/1000)+1}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 mt-2 border-t border-[var(--line)]">
                    <button 
                      onClick={handleDeploy}
                      disabled={isDeploying || selectedUsers.size === 0 || !taskTitle}
                      className="w-full bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--bg-0)] font-black py-4 uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_var(--glow-gold)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" /> {isDeploying ? "Deploying..." : "Deploy Task"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="glass-panel p-20 text-center border border-[var(--line)] flex flex-col items-center justify-center min-h-[500px]">
              <BarChart className="w-16 h-16 text-[var(--gold)]/50 mb-6" />
              <h2 className="text-2xl font-black text-white font-orbitron uppercase tracking-widest mb-3">Telemetry & Analytics</h2>
              <p className="text-[var(--text-soft)] max-w-md font-medium text-sm">
                Real-time tracking of task completion rates, average execution times, and cohort performance metrics will populate here as tasks are completed.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
