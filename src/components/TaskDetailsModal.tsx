"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/lib/data";
import { X, ExternalLink, ShieldCheck, Zap, Globe } from "lucide-react";

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, url: string) => void;
}

export function TaskDetailsModal({ task, isOpen, onClose, onSubmit }: TaskDetailsModalProps) {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(task!.id, url);
      setIsSubmitting(false);
      setUrl("");
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--bg-0)]/90 backdrop-blur-xl z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            className="fixed inset-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-full sm:max-w-xl z-[70] sm:p-4 overflow-y-auto"
          >
            <div className="glass-panel p-6 sm:p-8 relative overflow-hidden border border-[var(--line)] shadow-[0_0_50px_rgba(0,0,0,0.6)] min-h-screen sm:min-h-0">
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--gold)] opacity-5 blur-[60px] pointer-events-none" />

              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-[var(--text-soft)] hover:text-white transition-all hover:rotate-90 duration-300 p-2 bg-white/5 border border-[var(--line)] hover:border-[var(--gold)]/30"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[var(--gold)]/10 flex items-center justify-center border border-[var(--gold)]/30">
                    <Zap className="w-5 h-5 text-[var(--gold)] fill-[var(--gold)]" />
                  </div>
                  <h2 className="text-2xl xl:text-3xl font-black text-white font-orbitron uppercase tracking-wider">{task.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-[var(--gold)]/10 border border-[var(--gold)]/20 px-4 py-2">
                    <span className="text-[var(--gold)] font-black text-xs font-orbitron uppercase tracking-widest">
                      +{task.xp} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-soft)] font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 border border-[var(--line)]">
                    <Globe className="w-3.5 h-3.5" />
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-3">Mission Objective</h4>
                <p className="text-[15px] text-[var(--text-soft)] leading-relaxed font-medium">
                  {task.description}
                </p>
              </div>

              {task.status !== "completed" ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-3">
                    <label
                      htmlFor="url"
                      className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] flex items-center justify-between"
                    >
                      Verification Link (LinkedIn Post)
                      <span className="text-[var(--gold)] font-bold opacity-60">REQUIRED</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ExternalLink className="w-5 h-5 text-[var(--text-soft)] group-focus-within:text-[var(--gold)] transition-colors" />
                      </div>
                      <input
                        type="url"
                        id="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://linkedin.com/posts/..."
                        className="w-full bg-[var(--bg-0)]/60 border border-[var(--line)] py-4 pl-12 pr-4 text-white placeholder-[var(--text-soft)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !url}
                    className="w-full relative group overflow-hidden bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[var(--bg-0)] font-black py-4 transition-all shadow-[0_0_25px_var(--glow-gold)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 font-orbitron uppercase tracking-widest text-sm"
                  >
                    <div className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-[var(--bg-0)]/30 border-t-[var(--bg-0)] animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Submit Proof
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/30 p-6 flex items-center gap-5 text-[var(--gold)]">
                  <div className="w-14 h-14 bg-[var(--gold)]/10 flex items-center justify-center shrink-0 border border-[var(--gold)]/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black font-orbitron uppercase tracking-widest">Verified Complete</h4>
                    <p className="text-sm font-medium opacity-70 mt-1 text-[var(--text-soft)]">
                      Proof acknowledged. {task.xp} XP credited.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
