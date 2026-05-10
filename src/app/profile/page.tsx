"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProfileSection } from "@/components/ProfileSection";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:ml-56 p-4 pt-16 lg:pt-7 lg:pl-4 lg:pr-5 xl:pr-6 w-full overflow-x-hidden relative z-10">
        <div className="w-full max-w-[1180px] mr-auto pb-24 lg:pb-20 pt-4 xl:pt-8">
          <ProfileSection />
        </div>
      </main>
    </div>
  );
}
