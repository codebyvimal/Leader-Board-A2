"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent flex items-center justify-center text-white font-bold text-3xl tracking-wider shadow-[0_0_30px_rgba(124,58,237,0.5)] mb-6">
            A
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-white mb-2">ASCEND</h1>
          <p className="text-gray-400">Elite private roadmap competition.</p>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Access</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
              />
            </div>
            
            <Link href="/" className="block">
              <button className="w-full bg-white text-black font-semibold py-3 rounded-xl transition-all hover:bg-gray-200 mt-2 flex items-center justify-center gap-2 group">
                Enter Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-gray-600 text-xs font-medium">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3">
            <Lock className="w-5 h-5" />
            Continue with Email
          </button>
        </div>
        
        <p className="text-center text-gray-600 text-xs mt-8">
          By entering, you agree to the silent competition.
        </p>
      </motion.div>
    </div>
  );
}
