"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProfileSection } from "@/components/ProfileSection";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-content pt-4 xl:pt-6">
          <ProfileSection />
        </div>
      </main>
    </div>
  );
}
