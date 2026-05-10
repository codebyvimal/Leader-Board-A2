"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ActivityEvent, getActivity } from "@/lib/data";
import { Activity } from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    getActivity().then(setActivities);
  }, []);

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden relative z-10">
        <div className="max-w-[1200px] mx-auto pb-20 pt-4 xl:pt-10">
          <header className="mb-12">
            <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] mb-3 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Feed
            </p>
            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
              Activity
            </h1>
            <p className="text-[var(--text-soft)] mt-4 max-w-2xl text-sm lg:text-[16px] font-medium leading-relaxed">
              Every packet of progress captured in real-time.
            </p>
          </header>
          <ActivityFeed events={activities} />
        </div>
      </main>
    </div>
  );
}
