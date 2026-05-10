"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trophy, Map, Activity, User, Shield, LogOut, Menu, X, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentProfile, fallbackProfile, PublicProfile } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const navItems = [
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<PublicProfile>(fallbackProfile);

  useEffect(() => {
    async function init() {
      const userProfile = await getCurrentProfile();
      if (userProfile) {
        setProfile(userProfile);
        if (userProfile.handle === "ramadass" || userProfile.handle === "vimal") {
          setAdminAllowed(true);
        }
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 border-b border-[var(--line)] bg-[var(--bg-0)]/92 backdrop-blur-xl z-40 flex items-center justify-between px-4 progress-grid">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 hud-chip flex items-center justify-center text-[var(--bg-0)] font-black">
            <Cpu className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-black tracking-[0.2em] text-white font-orbitron">ASCEND</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="control-surface interactive-frame text-[var(--text-soft)] hover:text-[var(--gold)] p-1.5 transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ===== MOBILE BOTTOM NAV BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[68px] border-t border-[var(--line)] bg-[var(--bg-0)]/92 backdrop-blur-2xl z-50 flex items-center justify-around px-2 safe-area-bottom progress-grid">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/roadmap");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] transition-all duration-200 relative frame-cut",
                isActive
                  ? "text-[var(--gold)] panel-inset"
                  : "text-[var(--text-soft)] active:text-white"
              )}
            >
              {isActive && (
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[var(--gold)] shadow-[0_0_10px_var(--glow-gold)]" />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive ? "scale-110" : ""
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider",
                isActive ? "font-orbitron" : ""
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className={cn(
        "w-52 h-[100dvh] fixed left-0 top-0 border-r border-[var(--line)] glass-panel progress-grid flex flex-col pt-7 pb-6 px-3 z-50 transition-transform duration-500 ease-out shadow-[4px_0_16px_rgba(0,0,0,0.5)]",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 hud-chip flex items-center justify-center text-[var(--bg-0)] font-black relative group">
              <Cpu className="w-5 h-5" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <h1 className="text-xl font-black tracking-[0.2em] text-white font-orbitron">ASCEND</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden control-surface text-[var(--text-soft)] hover:text-white p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide -mx-1 px-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === "/" && item.href === "/roadmap");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-all duration-300 group relative interactive-frame frame-cut",
                  isActive
                    ? "panel-inset text-white"
                    : "text-[var(--text-soft)] hover:text-white control-surface border border-transparent"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-[var(--gold)]" : "")} />
                <span className={cn("font-bold tracking-wide", isActive ? "font-orbitron text-[11px] uppercase" : "text-[14px]")}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-[var(--gold)] shadow-[0_0_8px_var(--glow-gold)] dot-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3 pt-5">
          {/* User card */}
          <div className="glass-panel p-4 border border-[var(--line)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--gold)] opacity-5 blur-[30px] pointer-events-none group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 control-surface flex items-center justify-center text-xs font-black text-white shrink-0 group-hover:border-[var(--gold)] overflow-hidden transition-colors">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.avatarInitials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-white truncate font-orbitron">{profile.displayName}</div>
                <div className="text-[9px] text-[var(--gold)] mt-0.5 font-black uppercase tracking-[0.15em]">LVL {Math.floor((profile.xp || 0) / 1000) + 1} Operator</div>
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <div className="flex items-center justify-between text-[9px] font-black text-[var(--text-soft)] uppercase tracking-wider">
                <span>Core Power</span>
                <span className="text-white">{profile.xp || 0} XP</span>
              </div>
              <div className="mt-2 h-1.5 bg-black/20 overflow-hidden border border-[var(--line)] frame-cut">
                <div
                  className="h-full bg-gradient-to-r from-[var(--gold-muted)] to-[var(--gold)] relative"
                  style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {adminAllowed && (
            <Link
              href="/admin"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-[var(--text-soft)] hover:text-white transition-all interactive-frame frame-cut",
                pathname === "/admin" ? "panel-inset text-white" : "control-surface"
              )}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="font-bold text-[13px]">Protocol Control</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[var(--text-soft)] hover:text-[#f48787] transition-all group control-surface interactive-frame frame-cut"
          >
            <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[13px]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
