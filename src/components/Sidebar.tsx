"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trophy, Map, Activity, User, Shield, LogOut, Cpu, ChevronUp, X } from "lucide-react";
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
  const [moreOpen, setMoreOpen] = useState(false);
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
      {/* ===== MOBILE BOTTOM DASHBOARD ===== */}
      {/* Slide-up panel (user card + admin + logout) */}
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[55]"
          onClick={() => setMoreOpen(false)}
        />
      )}
      <div
        className={cn(
          "lg:hidden fixed left-0 right-0 bottom-0 z-[56] transition-transform duration-300 ease-out",
          moreOpen ? "translate-y-0" : "translate-y-[calc(100%-0px)]"
        )}
        style={{ bottom: "calc(72px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="glass-panel border border-[var(--line)] border-b-0 mx-2 p-4 space-y-3 shadow-[0_-12px_40px_rgba(0,0,0,0.5)]">
          {/* Close handle */}
          <button
            onClick={() => setMoreOpen(false)}
            className="absolute top-2 right-3 p-1 text-[var(--text-soft)] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* User card */}
          <div className="flex items-center gap-3 p-3 control-surface border border-[var(--line)]">
            <div className="w-10 h-10 control-surface flex items-center justify-center text-[10px] font-black text-white shrink-0 overflow-hidden border border-[var(--line)]">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.avatarInitials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold text-white truncate font-orbitron">{profile.displayName}</div>
              <div className="text-[9px] text-[var(--gold)] mt-0.5 font-black uppercase tracking-[0.14em]">LVL {Math.floor((profile.xp || 0) / 1000) + 1} Operator</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13px] font-black text-white font-orbitron">{profile.xp || 0}</div>
              <div className="text-[8px] text-[var(--text-soft)] uppercase tracking-wider font-bold">XP</div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="px-1">
            <div className="flex items-center justify-between text-[8px] font-black text-[var(--text-soft)] uppercase tracking-wider mb-1.5">
              <span>Core Power</span>
              <span className="text-white">{((profile.xp || 0) % 1000) / 10}%</span>
            </div>
            <div className="h-1.5 bg-black/20 overflow-hidden border border-[var(--line)] frame-cut">
              <div
                className="h-full bg-gradient-to-r from-[var(--gold-muted)] to-[var(--gold)] relative"
                style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }}
              />
            </div>
          </div>

          {/* Actions row */}
          <div className="flex gap-2 pt-1">
            {adminAllowed && (
              <Link
                href="/admin"
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest transition-all frame-cut",
                  pathname === "/admin" ? "panel-inset text-white" : "control-surface text-[var(--text-soft)] hover:text-white"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
            <button
              onClick={() => { setMoreOpen(false); handleLogout(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest control-surface text-[var(--text-soft)] hover:text-[#f48787] transition-all frame-cut"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--line)] bg-[var(--bg-1)]/96 backdrop-blur-2xl z-[58] flex items-stretch justify-around px-1 progress-grid shadow-[0_-10px_30px_rgba(0,0,0,0.32)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: "72px" }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/roadmap");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-2 min-w-[56px] flex-1 transition-all duration-200 relative",
                isActive
                  ? "text-white"
                  : "text-[var(--text-soft)] active:text-white"
              )}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--gold)]" />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-transform",
                isActive ? "scale-110 text-[var(--gold)]" : ""
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-wider",
                isActive ? "font-orbitron text-[var(--gold)]" : ""
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* More / Dashboard button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 py-2 px-2 min-w-[56px] flex-1 transition-all duration-200 relative",
            moreOpen ? "text-[var(--gold)]" : "text-[var(--text-soft)]"
          )}
        >
          {moreOpen && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--gold)]" />
          )}
          <div className="relative">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="You" className="w-6 h-6 object-cover border border-[var(--line)]" />
            ) : (
              <div className="w-6 h-6 control-surface flex items-center justify-center text-[8px] font-black border border-[var(--line)]">
                {profile.avatarInitials}
              </div>
            )}
            <ChevronUp className={cn(
              "absolute -top-1 -right-1 w-2.5 h-2.5 transition-transform duration-200",
              moreOpen ? "rotate-180" : ""
            )} />
          </div>
          <span className={cn(
            "text-[9px] font-black uppercase tracking-wider",
            moreOpen ? "font-orbitron" : ""
          )}>
            More
          </span>
        </button>
      </nav>

      {/* Mobile Overlay (for old hamburger — kept for safety) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className={cn(
        "w-[10rem] h-[100dvh] fixed left-0 top-0 border-r border-[var(--line)] glass-panel progress-grid flex-col pt-6 pb-5 px-2 z-50 transition-transform duration-300 ease-out shadow-[4px_0_16px_rgba(0,0,0,0.5)] hidden lg:flex",
      )}>
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 hud-chip flex items-center justify-center text-[var(--bg-0)] font-black relative group">
              <Cpu className="w-4 h-4" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <h1 className="text-[0.98rem] font-black tracking-[0.12em] text-white font-orbitron">ASCEND</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname === "/" && item.href === "/roadmap");
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-2.5 group relative interactive-frame frame-cut",
                  isActive
                    ? "panel-inset text-white border-[var(--gold)]/20"
                    : "text-[var(--text-soft)] hover:text-white control-surface border border-transparent"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-[var(--gold)]" : "")} />
                <span className={cn("font-bold tracking-wide", isActive ? "font-orbitron text-[9px] uppercase" : "text-[12px]")}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-[var(--gold)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2 pt-3">
          {/* User card */}
          <div className="glass-panel p-2.5 border border-[var(--line)] relative overflow-hidden group">
            <div className="flex items-center gap-2.5 relative z-10">
              <div className="w-8 h-8 control-surface flex items-center justify-center text-[9px] font-black text-white shrink-0 group-hover:border-[var(--gold)] overflow-hidden transition-colors">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.avatarInitials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate font-orbitron">{profile.displayName}</div>
                <div className="text-[8px] text-[var(--gold)] mt-0.5 font-black uppercase tracking-[0.14em]">LVL {Math.floor((profile.xp || 0) / 1000) + 1} Operator</div>
              </div>
            </div>

            <div className="mt-2.5 relative z-10">
              <div className="flex items-center justify-between text-[8px] font-black text-[var(--text-soft)] uppercase tracking-wider">
                <span>Core Power</span>
                <span className="text-white">{profile.xp || 0} XP</span>
              </div>
              <div className="mt-2 h-1.5 bg-black/20 overflow-hidden border border-[var(--line)] frame-cut">
                <div
                  className="h-full bg-gradient-to-r from-[var(--gold-muted)] to-[var(--gold)] relative"
                  style={{ width: `${((profile.xp || 0) % 1000) / 10}%` }}
                />
              </div>
            </div>
          </div>

          {adminAllowed && (
            <Link
              href="/admin"
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 text-[var(--text-soft)] hover:text-white transition-all interactive-frame frame-cut",
                pathname === "/admin" ? "panel-inset text-white" : "control-surface"
              )}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold text-[11px]">Protocol Control</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[var(--text-soft)] hover:text-[#f48787] transition-all group control-surface interactive-frame frame-cut"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[11px]">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
