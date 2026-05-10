"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Resolve username to email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", username)
        .single();

      if (profileError || !profile?.email) {
        throw new Error("Identity not found or unauthorized.");
      }

      // 2. Sign in with the resolved email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push("/roadmap");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm sm:max-w-md z-10 p-0 sm:p-6"
      >
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-[2.25rem] sm:text-4xl lg:text-5xl font-black tracking-[0.22em] sm:tracking-[0.3em] text-white mb-3 sm:mb-4 font-orbitron uppercase">
            ASCEND
          </h1>
          <p className="text-[var(--text-soft)] font-bold tracking-widest text-[10px] sm:text-xs uppercase opacity-60">Elite Protocol Terminal</p>
        </div>

        <div className="glass-panel p-6 sm:p-10 space-y-6 sm:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold)] opacity-5 blur-[40px] pointer-events-none" />
          
          <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-2.5 sm:space-y-3">
                <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] ml-1">Identity / Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[var(--text-soft)] group-focus-within:text-[var(--gold)] transition-colors">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="USERNAME"
                    required
                    className="w-full bg-[var(--bg-0)]/60 border border-[var(--line)] py-3.5 pl-11 pr-4 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] transition-all font-bold tracking-wider text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <label className="block text-[10px] font-black text-[var(--text-soft)] uppercase tracking-[0.2em] ml-1">Passcode</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-[var(--text-soft)] group-focus-within:text-[var(--gold)] transition-colors">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[var(--bg-0)]/60 border border-[var(--line)] py-3.5 pl-11 pr-4 text-white placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] transition-all font-bold tracking-wider text-sm"
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white/5 border border-[var(--line)] hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/10 text-white font-bold py-3.5 transition-all flex items-center justify-center gap-3 group mt-6 sm:mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--gold)]" />
              <span className="text-[12px] sm:text-sm uppercase tracking-widest font-bold">
                {loading ? "Authenticating..." : "Encrypted Access"}
              </span>
            </button>
          </form>
        </div>
        
        <p className="text-center text-[var(--text-soft)] text-[9px] sm:text-[10px] font-black mt-8 sm:mt-10 uppercase tracking-[0.2em] opacity-40">
          Terminal ID: 0xFF-PROTOCOL-A1
        </p>
      </motion.div>
    </div>
  );
}
