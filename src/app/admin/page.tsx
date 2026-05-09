"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Section, Task, TaskStatus, mockRoadmap } from "@/lib/data";
import { clearRoadmapStorage, loadRoadmapFromStorage, saveRoadmapToStorage } from "@/lib/roadmapStore";
import { cn } from "@/lib/utils";
import { Check, Download, Plus, Shield, Trash2, Upload } from "lucide-react";

type AdminAuth = {
  email: string;
  isAuthed: boolean;
};

const ADMIN_AUTH_KEY = "ascend:adminAuth:v1";

function loadAdminAuth(): AdminAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminAuth;
  } catch {
    return null;
  }
}

function saveAdminAuth(auth: AdminAuth) {
  try {
    window.localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(auth));
  } catch {
    // ignore
  }
}

function getInitialSections(): Section[] {
  return loadRoadmapFromStorage() ?? mockRoadmap;
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function AdminPage() {
  const [auth, setAuth] = useState<AdminAuth>(() => loadAdminAuth() ?? { email: "", isAuthed: false });
  const [email, setEmail] = useState("");
  const [sections, setSections] = useState<Section[]>(() => getInitialSections());
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(() => getInitialSections()[0]?.id ?? null);
  const selectedSection = useMemo(
    () => sections.find((s) => s.id === selectedSectionId) ?? null,
    [sections, selectedSectionId]
  );

  const persist = (next: Section[]) => {
    setSections(next);
    saveRoadmapToStorage(next);
  };

  const requireAuthed = auth.isAuthed;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 lg:gap-8">
            <div>
              <p className="text-accent font-medium tracking-widest text-xs lg:text-sm mb-2">ADMIN</p>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Roadmap Builder</h1>
              <p className="text-gray-400 mt-2 lg:mt-3 max-w-3xl text-sm lg:text-base">
                Create and edit the roadmap (sections + tasks). Changes are saved locally for now, and the main dashboard
                will use them automatically.
              </p>
            </div>

            <div className="flex sm:hidden items-center gap-2 text-xs font-semibold text-white bg-white/5 px-3 py-2 rounded-full border border-white/10">
              <Shield className={cn("w-4 h-4", requireAuthed ? "text-emerald-300" : "text-gray-400")} />
              {requireAuthed ? `Signed in as ${auth.email}` : "Not signed in"}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white bg-white/5 px-3 py-2 rounded-full border border-white/10">
              <Shield className={cn("w-4 h-4", requireAuthed ? "text-emerald-300" : "text-gray-400")} />
              {requireAuthed ? `Signed in as ${auth.email}` : "Not signed in"}
            </div>
          </header>

          {!requireAuthed ? (
            <section className="glass-card rounded-2xl p-6 max-w-xl border border-white/10">
              <div className="text-lg font-semibold text-white">Admin sign up</div>
              <p className="text-gray-400 mt-2 text-sm">
                This is UI-only authentication to unblock building. We can wire real auth later.
              </p>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const next = { email: email.trim(), isAuthed: true };
                  setAuth(next);
                  saveAdminAuth(next);
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Admin email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ascend.local"
                    className={inputClass}
                  />
                </div>

                <button className="w-full bg-white text-black font-semibold py-3 rounded-xl transition-all hover:bg-gray-200 mt-2 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  Create admin
                </button>
              </form>
            </section>
          ) : (
            <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
              {/* Left: Sections */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 h-fit">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-lg font-semibold text-white">Sections</div>
                  <button
                    className="text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    onClick={() => {
                      const nextSection: Section = { id: uid("section"), title: "New Section", tasks: [] };
                      const next = [nextSection, ...sections];
                      persist(next);
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
                          "w-full text-left px-4 py-3 rounded-xl border transition-colors",
                          isActive
                            ? "bg-white/10 border-white/15 text-white"
                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                        )}
                        onClick={() => setSelectedSectionId(s.id)}
                      >
                        <div className="font-semibold truncate">{s.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.tasks.length} tasks</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                  <button
                    className="text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(sections, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "ascend-roadmap.json";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>

                  <label className="text-xs font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import JSON
                    <input
                      type="file"
                      accept="application/json"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const text = await file.text();
                        const parsed = JSON.parse(text) as Section[];
                        persist(parsed);
                        setSelectedSectionId(parsed[0]?.id ?? null);
                        e.currentTarget.value = "";
                      }}
                    />
                  </label>

                  <button
                    className="text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                    onClick={() => {
                      clearRoadmapStorage();
                      persist(mockRoadmap);
                      setSelectedSectionId(mockRoadmap[0]?.id ?? null);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset
                  </button>
                </div>
              </div>

              {/* Right: Editor */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                {!selectedSection ? (
                  <div className="text-gray-400">Select a section to edit.</div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Section title</label>
                        <input
                          value={selectedSection.title}
                          onChange={(e) => {
                            const next = sections.map((s) =>
                              s.id === selectedSection.id ? { ...s, title: e.target.value } : s
                            );
                            persist(next);
                          }}
                          className={inputClass}
                        />
                      </div>
                      <button
                        className="text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3 py-3 rounded-xl transition-colors inline-flex items-center gap-2 h-[46px]"
                        onClick={() => {
                          const next = sections.filter((s) => s.id !== selectedSection.id);
                          persist(next);
                          setSelectedSectionId(next[0]?.id ?? null);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete section
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold text-white">Tasks</div>
                      <button
                        className="text-xs font-semibold text-white bg-accent/20 hover:bg-accent/30 border border-accent/20 px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-2"
                        onClick={() => {
                          const task: Task = {
                            id: uid("task"),
                            title: "New task",
                            description: "Describe the task and how proof should be submitted.",
                            xp: 250,
                            deadline: new Date().toISOString().slice(0, 10),
                            status: "upcoming",
                          };
                          const next = sections.map((s) =>
                            s.id === selectedSection.id ? { ...s, tasks: [task, ...s.tasks] } : s
                          );
                          persist(next);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Add task
                      </button>
                    </div>

                    <div className="space-y-4">
                      {selectedSection.tasks.map((t) => (
                        <TaskEditor
                          key={t.id}
                          task={t}
                          onChange={(nextTask) => {
                            const next = sections.map((s) => {
                              if (s.id !== selectedSection.id) return s;
                              return { ...s, tasks: s.tasks.map((x) => (x.id === t.id ? nextTask : x)) };
                            });
                            persist(next);
                          }}
                          onDelete={() => {
                            const next = sections.map((s) => {
                              if (s.id !== selectedSection.id) return s;
                              return { ...s, tasks: s.tasks.filter((x) => x.id !== t.id) };
                            });
                            persist(next);
                          }}
                        />
                      ))}

                      {selectedSection.tasks.length === 0 && (
                        <div className="text-gray-500 text-sm bg-white/5 border border-white/10 rounded-xl p-5">
                          No tasks yet. Add your first task.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function TaskEditor(props: {
  task: Task;
  onChange: (next: Task) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
          <input
            value={props.task.title}
            onChange={(e) => props.onChange({ ...props.task, title: e.target.value })}
            className={inputClass}
          />
        </div>
        <button
          className="text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-3 py-3 rounded-xl transition-colors inline-flex items-center gap-2 h-[46px]"
          onClick={props.onDelete}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
        <textarea
          value={props.task.description}
          onChange={(e) => props.onChange({ ...props.task, description: e.target.value })}
          className={cn(inputClass, "min-h-[96px] resize-none")}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">XP</label>
          <input
            type="number"
            min={0}
            value={props.task.xp}
            onChange={(e) => props.onChange({ ...props.task, xp: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Deadline</label>
          <input
            type="date"
            value={props.task.deadline}
            onChange={(e) => props.onChange({ ...props.task, deadline: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
          <select
            value={props.task.status}
            onChange={(e) => props.onChange({ ...props.task, status: e.target.value as TaskStatus })}
            className={cn(inputClass, "pr-10")}
          >
            <option value="upcoming">Upcoming</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

