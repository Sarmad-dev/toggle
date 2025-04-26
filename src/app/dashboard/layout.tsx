"use client";
import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import queryClient from "@/lib/tanstack/queryClient";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { RealtimeManager } from "@/lib/realtime";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useUserContext } from "@/context/UserContext";

// export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUserContext();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    RealtimeManager.subscribeToNotifications(userId, (notification) => {
      // Show notification toast
      toast(notification.title, {
        description: notification.message,
      });

      // Invalidate relevant queries based on notification type
      switch (notification.type) {
        case "PROJECT_INVITATION":
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          break;
        case "TASK_ASSIGNED":
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          break;
      }
    });

    return () => {
      if (userId) {
        RealtimeManager.unsubscribeFromNotifications(userId);
      }
    };
  }, [userId]);

  try {
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
            <div className="container p-6 mt-10 mx-auto h-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Dashboard layout error:", error);
    return redirect("/auth/sign-in");
  }
}
