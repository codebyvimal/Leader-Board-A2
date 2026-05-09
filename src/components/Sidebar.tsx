"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trophy, Map, Activity, User, Shield, LogOut, Menu, X, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentProfile, fallbackProfile, PublicProfile } from "@/lib/data";
import { supabase } from "@/lib/supabase";

const navItems = [
  { name: "Roadmap", href: "#roadmap", icon: Map },
  { name: "Leaderboard", href: "#leaderboard", icon: Trophy },
  { name: "Activity", href: "#activity", icon: Activity },
  { name: "Profile", href: "#profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [adminAllowed, setAdminAllowed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#roadmap");
  const [profile, setProfile] = useState<PublicProfile>(fallbackProfile);

  useEffect(() => {
    async function init() {
      const userProfile = await getCurrentProfile();
      if (userProfile) {
        setProfile(userProfile);
        
        // Admin check based on handles
        if (userProfile.handle === "ramadass" || userProfile.handle === "vimal") {
          setAdminAllowed(true);
        }
      }
    }
    init();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ["roadmap", "leaderboard", "activity", "profile"];
      let current = activeHash;
      
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = `#${id}`;
          }
        }
      }
      
      if (current !== activeHash) {
        setActiveHash(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    if (window.location.hash) {
      setActiveHash(window.location.hash);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeHash]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 border-b border-[var(--line)] bg-[var(--bg-0)]/80 backdrop-blur-xl z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold)] flex items-center justify-center text-[var(--bg-0)] font-black shadow-[0_0_20px_var(--glow-gold)]">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black tracking-[0.2em] text-white font-orbitron">ASCEND</h1>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-[var(--text-soft)] hover:text-[var(--gold)] p-2 rounded-xl bg-white/5 transition-all"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-72 h-[100dvh] fixed left-0 top-0 border-r border-[var(--line)] glass-panel flex flex-col pt-10 pb-8 px-6 z-50 transition-transform duration-500 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[var(--gold)] flex items-center justify-center text-[var(--bg-0)] font-black shadow-[0_0_25px_var(--glow-gold)] relative group">
              <Cpu className="w-6 h-6" />
              <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
            <h1 className="text-2xl font-black tracking-[0.25em] text-white font-orbitron">ASCEND</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="lg:hidden text-[var(--text-soft)] hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden scrollbar-hide -mx-2 px-2">
          {navItems.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveHash(item.href);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "bg-[var(--gold)]/10 text-white border border-[var(--gold)]/20 shadow-[0_0_20px_var(--glow-gold)]" 
                    : "text-[var(--text-soft)] hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-[var(--gold)] drop-shadow-[0_0_8px_var(--glow-gold)]" : "")} />
                <span className={cn("font-bold tracking-wide", isActive ? "font-orbitron text-xs uppercase" : "text-[15px]")}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)] shadow-[0_0_10px_var(--glow-gold)]" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-6">
          <div className="glass-panel rounded-2xl p-5 border border-[var(--line)] glow-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--gold)] opacity-5 blur-[40px] pointer-events-none group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--bg-0)] to-[var(--bg-1)] flex items-center justify-center text-sm font-black text-white border border-[var(--line)] shadow-[0_4px_12px_rgba(0,0,0,0.5)] shrink-0 group-hover:border-[var(--gold)] overflow-hidden transition-colors">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.avatarInitials
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-white truncate font-orbitron">{profile.displayName}</div>
                <div className="text-[10px] text-[var(--gold)] mt-0.5 font-black uppercase tracking-[0.15em]">LVL {Math.floor((profile.xp || 0) / 1000) + 1} Operator</div>
              </div>
            </div>

            <div className="mt-5 relative z-10">
              <div className="flex items-center justify-between text-[10px] font-black text-[var(--text-soft)] uppercase tracking-wider">
                <span>Core Power</span>
                <span className="text-white">{profile.xp || 0} XP</span>
              </div>
              <div className="mt-2.5 h-1.5 rounded-full bg-white/5 overflow-hidden border border-[var(--line)]">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--gold-muted)] to-[var(--gold)] relative shadow-[0_0_10px_var(--glow-gold)]"
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
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-[var(--text-soft)] hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-[var(--line)]"
            >
              <Shield className="w-5 h-5 shrink-0" />
              <span className="font-bold text-[15px]">Protocol Control</span>
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-[var(--text-soft)] hover:text-[#ff4d6d] hover:bg-[#ff4d6d]/10 transition-all group"
          >
            <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-[15px]">Terminate Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}

