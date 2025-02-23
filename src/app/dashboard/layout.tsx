"use client";
import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import queryClient from "@/lib/tanstack/queryClient";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { RealtimeManager } from "@/lib/realtime";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

// export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);

  try {
    supabase.auth
      .getUser()
      .then(({ data: user }) => setUserId(user.user?.id as string));

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

    // await queryClient.prefetchQuery({ queryKey: ["all-projects"], queryFn: () => getProjects(user?.id as string) })
    // await queryClient.prefetchQuery({ queryKey: ["all-teams"], queryFn: () => getAllTeams()})
    // await queryClient.prefetchQuery({
    //       queryKey: ["manager-teams"],
    //       queryFn: async () => await getManagerTeams(user?.id as string),
    //     }
    // )
    // await queryClient.prefetchQuery({
    //   queryKey: ["teams"],
    //       queryFn: async () => await getTeams(user?.id as string),
    // })
    // await queryClient.prefetchQuery({
    //     queryKey: ["time-tracking-stats"],
    //     queryFn: async () => await getTimeTrackingStats(user?.id as string),
    //   })

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
  } catch (error) {
    console.error("Dashboard layout error:", error);
    return redirect("/auth/login");
  }
}
