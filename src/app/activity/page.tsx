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
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-52 p-4 pt-16 lg:pt-7 lg:pl-2 lg:pr-5 xl:pr-6 w-full overflow-x-hidden relative z-10">
        <div className="w-full max-w-[1180px] mr-auto pb-24 lg:pb-20 pt-4 xl:pt-8">
          <header className="mb-10">
            <p className="text-[var(--gold)] font-black tracking-[0.25em] text-[10px] mb-3 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Feed
            </p>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-gradient font-orbitron uppercase">
              Activity
            </h1>
            <p className="text-[var(--text-soft)] mt-3 max-w-2xl text-sm lg:text-[15px] font-medium leading-relaxed">
              Every packet of progress captured in real-time.
            </p>
          </header>
          <ActivityFeed events={activities} />
        </div>
      </main>
    </div>
  );
}
