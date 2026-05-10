"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProfileSection } from "@/components/ProfileSection";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 lg:pl-12 lg:pr-12 w-full overflow-x-hidden relative z-10">
        <div className="max-w-[1200px] mx-auto pb-20 pt-4 xl:pt-10">
          <ProfileSection />
        </div>
      </main>
    </div>
  );
}
