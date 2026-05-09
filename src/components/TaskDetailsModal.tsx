"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "@/lib/data";
import { X, ExternalLink, ShieldCheck } from "lucide-react";

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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-1"
          >
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
              
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-accent font-medium px-2 py-1 bg-accent/10 rounded border border-accent/20">
                    +{task.xp} XP
                  </span>
                  <span className="text-gray-400">
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {task.status !== 'completed' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-400 mb-2">
                      Proof of Completion (LinkedIn Post URL)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                      </div>
                      <input
                        type="url"
                        id="url"
                        required
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://linkedin.com/posts/..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !url}
                    className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Submit for Verification
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3 text-accent">
                  <ShieldCheck className="w-6 h-6" />
                  <div>
                    <h4 className="font-medium">Verification Approved</h4>
                    <p className="text-sm opacity-80 mt-1">You&apos;ve successfully completed this task and earned {task.xp} XP.</p>
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
