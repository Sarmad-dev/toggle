import { Header } from "@/components/dashboard/header";
import LeftSidebar from "@/components/dashboard/LeftSidebar";
import { getProjects } from "@/lib/actions/projects";
import { getAllTeams, getTimeTrackingStats } from "@/lib/actions/reports";
import { getManagerTeams, getTeams } from "@/lib/actions/teams";
import { getUser } from "@/lib/actions/user";
import queryClient from "@/lib/tanstack/queryClient";

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUser()
  // useEffect(() => {
  //   if (!user?.id) return;
    
  //   RealtimeManager.subscribeToNotifications(user.id, (notification) => {
  //     // Show notification toast
  //     toast(notification.title, {
  //       description: notification.message,
  //     });

  //     // Invalidate relevant queries based on notification type
  //     switch (notification.type) {
  //       case "PROJECT_INVITATION":
  //         queryClient.invalidateQueries({ queryKey: ["projects"] });
  //         break;
  //       case "TASK_ASSIGNED":
  //         queryClient.invalidateQueries({ queryKey: ["tasks"] });
  //         break;
  //     }
  //   });

  //   return () => {
  //     if (user?.id) {
  //       RealtimeManager.unsubscribeFromNotifications(user.id);
  //     }
  //   };
  // }, [user?.id]);

  await queryClient.prefetchQuery({ queryKey: ["all-projects"], queryFn: () => getProjects(user?.id as string) })
  await queryClient.prefetchQuery({ queryKey: ["all-teams"], queryFn: () => getAllTeams()})
  await queryClient.prefetchQuery({ 
        queryKey: ["manager-teams"],
        queryFn: async () => await getManagerTeams(user?.id as string),
      }
  )
  await queryClient.prefetchQuery({
    queryKey: ["teams"],
        queryFn: async () => await getTeams(user?.id as string),
  })
  await queryClient.prefetchQuery({
      queryKey: ["time-tracking-stats"],
      queryFn: async () => await getTimeTrackingStats(user?.id as string),
    })

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
