"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, Map, Activity, User, Shield, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockPublicProfile } from "@/lib/data";

const ADMIN_AUTH_KEY = "ascend:adminAuth:v1";

const navItems = [
  { name: "Roadmap", href: "/", icon: Map },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [adminAllowed, setAdminAllowed] = useState<boolean>(() => false);
  const [isOpen, setIsOpen] = useState(false);
  
  const adminEmail = useMemo(() => {
    if (typeof window === "undefined") return "";
    try {
      const raw = window.localStorage.getItem(ADMIN_AUTH_KEY);
      if (!raw) return "";
      const parsed = JSON.parse(raw) as { email?: string; isAuthed?: boolean };
      if (!parsed?.isAuthed || !parsed?.email) return "";
      return String(parsed.email);
    } catch {
      return "";
    }
  }, []);

  // Async update is OK with this repo’s hooks lint (it flags only synchronous setState in effect body).
  useEffect(() => {
    if (!adminEmail) return;
    fetch("/api/admin/allowed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail }),
    })
      .then((r) => r.json())
      .then((data: { allowed?: boolean }) => setAdminAllowed(Boolean(data.allowed)))
      .catch(() => setAdminAllowed(false));
  }, [adminEmail]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-bold tracking-wider shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            A
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white">ASCEND</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 h-[100dvh] fixed left-0 top-0 border-r border-border glass flex flex-col pt-8 pb-6 px-4 z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-12 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-bold tracking-wider shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              A
            </div>
            <h1 className="text-xl font-bold tracking-widest text-white">ASCEND</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide -mx-2 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-r-md shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
                )}
                <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-accent drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]" : "")} />
                <span className="font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 pt-4">
          <div className="mb-3 glass-card rounded-2xl p-4 border border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm font-bold text-white border border-white/10 shadow-inner shrink-0">
                {mockPublicProfile.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white truncate">{mockPublicProfile.displayName}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">Level 14</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.45)] shrink-0" />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500">
                <span>2,300 / 3,000 XP</span>
                <span>76%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                <div className="h-full w-[76%] bg-accent/80" />
              </div>
            </div>
          </div>

          {adminAllowed && (
            <Link
              href="/admin"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            >
              <Shield className="w-5 h-5 shrink-0" />
              <span className="font-medium truncate">Admin</span>
            </Link>
          )}
          <Link
            href="/login"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium truncate">Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
