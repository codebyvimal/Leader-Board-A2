"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const publicRoute = pathname === "/login";

  useEffect(() => {
    let alive = true;

    const redirectTo = (target: string) => {
      router.replace(target);
    };

    async function checkAuth() {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 1200)),
        ]);
        const session = result && "data" in result ? result.data.session : null;

        if (!alive) return;

        if (!session && !publicRoute) {
          redirectTo("/login");
        } else if (session && publicRoute) {
          redirectTo("/roadmap");
        }
      } catch {
        if (!alive) return;
        if (!publicRoute) {
          redirectTo("/login");
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!alive) return;

      if (event === "SIGNED_OUT" && !publicRoute) {
        redirectTo("/login");
      } else if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session && publicRoute) {
        redirectTo("/roadmap");
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [publicRoute, router]);

  return <>{children}</>;
}
