"use client";

import { Sidebar } from "@/components/Sidebar";
import { ActivityFeed } from "@/components/ActivityFeed";
import { mockActivity } from "@/lib/data";

export default function ActivityPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 lg:mb-10">
            <p className="text-accent font-medium tracking-widest text-xs lg:text-sm mb-2">SEASON 1</p>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">Activity</h1>
            <p className="text-gray-400 mt-2 lg:mt-3 max-w-2xl text-sm lg:text-base">
              Proof submissions, streak milestones, and leaderboard shifts — all in one feed.
            </p>
          </header>

          <ActivityFeed events={mockActivity} />
        </div>
      </main>
    </div>
  );
}

