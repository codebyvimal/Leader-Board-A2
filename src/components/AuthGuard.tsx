"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && pathname !== "/login") {
        router.push("/login");
      } else if (session && pathname === "/login") {
        router.push("/");
      } else {
        setAuthed(true);
      }
      setLoading(false);
    }
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && pathname !== "/login") {
        router.push("/login");
      } else if (event === 'SIGNED_IN' && pathname === "/login") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div className="min-h-screen bg-[var(--bg-0)] flex items-center justify-center text-[var(--gold)] font-orbitron tracking-widest uppercase text-sm animate-pulse">Verifying Access Level...</div>;
  }

  return <>{children}</>;
}
