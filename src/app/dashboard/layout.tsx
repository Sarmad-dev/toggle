"use client";

import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-light dark:bg-gradient-dark"
      suppressHydrationWarning
    >
      <Header />
      <div className="flex overflow-hidden pt-14">
        <LeftSidebar />

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
