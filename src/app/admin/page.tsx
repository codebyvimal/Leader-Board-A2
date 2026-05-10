"use client";

import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Section, Task, TaskStatus, getRoadmap } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, Plus, Shield, Trash2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

const inputClass =
  "w-full bg-white/5 border border-[var(--line)] py-4 px-5 text-white placeholder-[var(--text-soft)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] transition-all font-bold text-[14px]";

export default function AdminPage() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const { getCurrentProfile, getLeaderboard } = await import("@/lib/data");
      const userProfile = await getCurrentProfile();

      if (session?.user && userProfile) {
        if (userProfile.handle === "ramadass" || userProfile.handle === "vimal") {
          setAdminEmail(userProfile.handle);
        }
      }

      const fetched = await getRoadmap();
      setSections(fetched);
      if (fetched.length > 0) setSelectedSectionId(fetched[0].id);

      const fetchedUsers = await getLeaderboard();
      setUsers(fetchedUsers);
    }
    init();
  }, []);

  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId) ?? null,
    [sections, selectedSectionId]
  );

  const requireAuthed = adminEmail !== null;

  const saveToSupabase = async () => {
    setSaving(true);
    try {
      await supabase.from("tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      let orderIndex = 0;
      for (const section of sections) {
        for (const task of section.tasks) {
          await supabase.from("tasks").insert({
            id: task.id,
            section_title: section.title,
            title: task.title,
            description: task.description,
            xp_reward: task.xp,
            deadline: task.deadline,
            status: task.status,
            order_index: orderIndex++,
          });
        }
      }
      alert("Roadmap synced to database!");
    } catch (err) {
      console.error(err);
      alert("Error saving to database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 lg:gap-8">
            <div>
              <p className="text-[var(--gold)] font-black tracking-widest text-xs lg:text-sm mb-2 font-orbitron uppercase">Protocol Control</p>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-orbitron">Admin Control Center</h1>
              <p className="text-[var(--text-soft)] mt-2 lg:mt-3 max-w-3xl text-sm lg:text-base font-medium">
                Create roadmap tasks and assign XP to students. All changes sync to the database.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white bg-white/5 px-4 py-3 border border-white/10 shadow-lg">
              <Shield className={cn("w-4 h-4", requireAuthed ? "text-[var(--gold)]" : "text-gray-500")} />
              {requireAuthed ? `Admin: ${adminEmail}` : "Access Denied"}
            </div>
          </header>

          {!requireAuthed ? (
            <section className="glass-panel p-8 max-w-xl border border-[var(--line)]">
              <div className="text-xl font-black text-white font-orbitron tracking-widest uppercase text-center">Admin Access Required</div>
              <p className="text-[var(--text-soft)] mt-4 text-sm text-center font-medium">
                You must be logged in with an authorized admin account.
              </p>
            </section>
          ) : (
            <>
              <StudentManager users={users} />

              <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 mt-8">
                {/* Left: Sections */}
                <div className="glass-panel p-6 border border-[var(--line)] h-fit shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-lg font-black text-white uppercase tracking-widest font-orbitron">Sections</div>
                    <button
                      className="text-xs font-bold text-[var(--bg-0)] bg-[var(--gold)] hover:bg-[var(--gold-light)] px-3 py-2 transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
                      onClick={() => {
                        const nextSection: Section = { id: uid("section"), title: "New Section", tasks: [] };
                        const next = [...sections, nextSection];
                        setSections(next);
                        setSelectedSectionId(nextSection.id);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sections.map((s) => {
                      const isActive = s.id === selectedSectionId;
                      return (
                        <button
                          key={s.id}
                          className={cn(
                            "w-full text-left px-4 py-4 border transition-all duration-300",
                            isActive
                              ? "bg-[var(--gold)]/10 border-[var(--gold)]/30 text-white"
                              : "bg-white/5 border-white/5 text-[var(--text-soft)] hover:bg-white/10"
                          )}
                          onClick={() => setSelectedSectionId(s.id)}
                        >
                          <div className="font-bold truncate text-[15px]">{s.title}</div>
                          <div className="text-[11px] text-[var(--gold)] font-black uppercase tracking-widest mt-1">{s.tasks.length} tasks</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-8 border-t border-[var(--line)]">
                    <button
                      onClick={saveToSupabase}
                      disabled={saving}
                      className="w-full text-sm font-black text-[var(--bg-0)] bg-[var(--gold)] hover:bg-[var(--gold-light)] px-4 py-4 transition-all inline-flex items-center justify-center gap-3 uppercase tracking-widest shadow-[0_0_20px_var(--glow-gold)] disabled:opacity-50"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? "Syncing..." : "Sync to Database"}
                    </button>
                  </div>
                </div>

                {/* Right: Editor */}
                <div className="glass-panel p-8 border border-[var(--line)] shadow-xl">
                  {!selectedSection ? (
                    <div className="text-[var(--text-soft)] font-medium text-center py-20">Select a section to edit.</div>
                  ) : (
                    <>
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
                        <div className="flex-1">
                          <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">Section Title</label>
                          <input
                            value={selectedSection.title}
                            onChange={(e) => {
                              const next = sections.map((s) =>
                                s.id === selectedSection.id ? { ...s, title: e.target.value } : s
                              );
                              setSections(next);
                            }}
                            className={inputClass}
                          />
                        </div>
                        <button
                          className="text-xs font-bold text-[#cc5555] bg-[#cc5555]/10 hover:bg-[#cc5555]/20 border border-[#cc5555]/20 px-5 py-3 transition-colors inline-flex items-center gap-2 h-[56px] uppercase tracking-wider"
                          onClick={() => {
                            const next = sections.filter((s) => s.id !== selectedSection.id);
                            setSections(next);
                            setSelectedSectionId(next[0]?.id ?? null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Section
                        </button>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="text-xl font-black text-white uppercase tracking-widest font-orbitron">Tasks</div>
                        <button
                          className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3 transition-colors inline-flex items-center gap-2 uppercase tracking-wider"
                          onClick={() => {
                            const task: Task = {
                              id: uid("task"),
                              title: "New Task",
                              description: "Describe the task.",
                              xp: 250,
                              deadline: new Date().toISOString().slice(0, 10),
                              status: "upcoming",
                            };
                            const next = sections.map((s) =>
                              s.id === selectedSection.id ? { ...s, tasks: [...s.tasks, task] } : s
                            );
                            setSections(next);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          Add Task
                        </button>
                      </div>

                      <div className="space-y-6">
                        {selectedSection.tasks.map((t) => (
                          <TaskEditor
                            key={t.id}
                            task={t}
                            onChange={(nextTask) => {
                              const next = sections.map((s) => {
                                if (s.id !== selectedSection.id) return s;
                                return { ...s, tasks: s.tasks.map((x) => (x.id === t.id ? nextTask : x)) };
                              });
                              setSections(next);
                            }}
                            onDelete={() => {
                              const next = sections.map((s) => {
                                if (s.id !== selectedSection.id) return s;
                                return { ...s, tasks: s.tasks.filter((x) => x.id !== t.id) };
                              });
                              setSections(next);
                            }}
                          />
                        ))}

                        {selectedSection.tasks.length === 0 && (
                          <div className="text-[var(--text-soft)] text-sm bg-white/5 border border-[var(--line)] p-8 text-center font-medium">
                            No tasks yet. Add your first task above.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StudentManager({ users }: { users: any[] }) {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [taskTitle, setTaskTitle] = useState("");
  const [xpAmount, setXpAmount] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedUserId || !taskTitle) return alert("Please fill all fields");
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const res = await fetch("/api/admin/assign-xp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ studentId: selectedUserId, taskTitle, xpAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign");
      alert(`Successfully awarded ${xpAmount} XP!`);
      setTaskTitle("");
      setXpAmount(10);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 border border-[var(--line)] shadow-xl mb-8">
      <h2 className="text-xl font-black text-white uppercase font-orbitron mb-6 flex items-center gap-3">
        <Shield className="w-5 h-5 text-[var(--gold)]" />
        Direct XP Award
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className={inputClass}
        >
          <option value="">Select Student...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.handle || u.displayName}</option>
          ))}
        </select>

        <input
          placeholder="Task Title / Reason"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className={cn(inputClass, "md:col-span-2")}
        />

        <input
          type="number"
          min={10}
          max={30}
          value={xpAmount}
          onChange={(e) => {
            let val = parseInt(e.target.value) || 10;
            if (val > 30) val = 30;
            if (val < 10) val = 10;
            setXpAmount(val);
          }}
          className={inputClass}
        />
      </div>

      <button
        disabled={loading}
        onClick={handleAssign}
        className="mt-6 w-full bg-[var(--gold)] text-[var(--bg-0)] font-black py-4 uppercase tracking-widest hover:bg-[var(--gold-light)] disabled:opacity-50 transition-colors shadow-[0_0_20px_var(--glow-gold)]"
      >
        {loading ? "Transmitting..." : "Assign Task & Award XP"}
      </button>
    </div>
  );
}

function TaskEditor(props: {
  task: Task;
  onChange: (next: Task) => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-[var(--line)] bg-[var(--bg-0)] p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">Title</label>
          <input
            value={props.task.title}
            onChange={(e) => props.onChange({ ...props.task, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <button
          className="text-xs font-bold text-[#cc5555] bg-[#cc5555]/10 hover:bg-[#cc5555]/20 border border-[#cc5555]/20 px-3 py-3 transition-colors inline-flex items-center gap-2 h-[56px]"
          onClick={props.onDelete}
          aria-label="Delete Task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-5">
        <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">Description</label>
        <textarea
          value={props.task.description}
          onChange={(e) => props.onChange({ ...props.task, description: e.target.value })}
          className={cn(inputClass, "min-h-[100px] resize-none")}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">XP Reward</label>
          <input
            type="number"
            min={10}
            max={30}
            value={props.task.xp}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10) || 10;
              if (val > 30) val = 30;
              if (val < 10) val = 10;
              props.onChange({ ...props.task, xp: val });
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">Deadline</label>
          <input
            type="date"
            value={props.task.deadline}
            onChange={(e) => props.onChange({ ...props.task, deadline: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-2">Status</label>
          <select
            value={props.task.status}
            onChange={(e) => props.onChange({ ...props.task, status: e.target.value as TaskStatus })}
            className={cn(inputClass, "pr-10")}
          >
            <option value="upcoming">Upcoming</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>
    </div>
  );
}
