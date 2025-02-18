"use client";

import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import { RealtimeManager } from "@/lib/realtime";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    
    RealtimeManager.subscribeToNotifications(user.id, (notification) => {
      // Handle new notification
      // You can update your notifications state here
    });

    return () => {
      if (user?.id) {
        RealtimeManager.unsubscribeFromNotifications(user.id);
      }
    };
  }, [user?.id]);

  return (
    <div
      className="relative min-h-screen bg-gradient-light dark:bg-gradient-dark"
      suppressHydrationWarning
    >
      <Header />
      <div className="flex overflow-hidden pt-5 h-screen">
        <div className="sticky top-0 h-screen">
          <LeftSidebar />
        </div>

        <main className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="container p-6 mt-10 mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
