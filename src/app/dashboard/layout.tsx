"use client";

import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import { RealtimeManager } from "@/lib/realtime";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;
    
    RealtimeManager.subscribeToNotifications(user.id, (notification) => {
      // Show notification toast
      toast(notification.title, {
        description: notification.message,
      });

      // Invalidate relevant queries based on notification type
      switch (notification.type) {
        case "INVOICE_CREATED":
        case "INVOICE_UPDATED":
        case "INVOICE_STATUS_CHANGED":
          queryClient.invalidateQueries({ queryKey: ["invoices"] });
          break;
        case "PROJECT_UPDATED":
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          break;
        case "TEAM_UPDATED":
          queryClient.invalidateQueries({ queryKey: ["teams"] });
          break;
      }
    });

    return () => {
      if (user?.id) {
        RealtimeManager.unsubscribeFromNotifications(user.id);
      }
    };
  }, [user?.id, queryClient]);

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
