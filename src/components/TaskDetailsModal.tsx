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
    // Simulate API call
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
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[70] p-4"
          >
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden border border-[var(--line)] shadow-[0_0_50px_rgba(0,0,0,0.5)] glow-border">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--electric-blue)] to-transparent opacity-50" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--electric-blue)] opacity-10 blur-[60px] pointer-events-none" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-[var(--text-soft)] hover:text-white transition-all hover:rotate-90 p-2 rounded-xl bg-white/5"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--electric-blue)]/10 flex items-center justify-center border border-[var(--electric-blue)]/30">
                    <Zap className="w-5 h-5 text-[var(--electric-blue)] fill-[var(--electric-blue)]" />
                  </div>
                  <h2 className="text-2xl xl:text-3xl font-black text-white font-orbitron uppercase tracking-wider">{task.title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/20 px-4 py-2 rounded-xl">
                    <span className="text-[var(--electric-blue)] font-black text-xs font-orbitron uppercase tracking-widest">
                      +{task.xp} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-soft)] font-bold text-xs uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-[var(--line)]">
                    <Globe className="w-3.5 h-3.5" />
                    Protocol Due: {new Date(task.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] mb-4">Mission Objective</h4>
                <p className="text-[16px] text-[var(--text-soft)] leading-relaxed font-medium">
                  {task.description}
                </p>
              </div>

              {task.status !== 'completed' ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="url" className="text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] flex items-center justify-between">
                      Verification Link (LinkedIn Post)
                      <span className="text-[var(--electric-blue)] font-bold opacity-60">REQUIRED</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ExternalLink className="w-5 h-5 text-[var(--text-soft)] group-focus-within:text-[var(--electric-blue)] transition-colors" />
                      </div>
                      <input
                        type="url"
                        id="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://linkedin.com/posts/..."
                        className="w-full bg-[var(--bg-0)]/60 border border-[var(--line)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--electric-blue)]/30 focus:border-[var(--electric-blue)] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !url}
                    className="w-full relative group overflow-hidden bg-[var(--electric-blue)] hover:bg-[var(--electric-blue)]/90 text-[var(--bg-0)] font-black py-4 rounded-2xl transition-all shadow-[0_0_30px_var(--glow-blue)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 font-orbitron uppercase tracking-widest text-sm"
                  >
                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-3 border-[var(--bg-0)]/30 border-t-[var(--bg-0)] rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-6 h-6" />
                        Transmit Proof
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-[var(--electric-blue)]/5 border border-[var(--electric-blue)]/30 rounded-2xl p-6 flex items-center gap-5 text-[var(--electric-blue)] shadow-[0_0_20px_var(--glow-blue)]">
                  <div className="w-14 h-14 rounded-xl bg-[var(--electric-blue)]/20 flex items-center justify-center shrink-0 border border-[var(--electric-blue)]/30">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black font-orbitron uppercase tracking-widest">Protocol Verified</h4>
                    <p className="text-sm font-medium opacity-80 mt-1">Proof of completion acknowledged. {task.xp} XP added to your neural network.</p>
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
