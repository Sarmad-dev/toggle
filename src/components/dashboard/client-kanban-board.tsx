// Client-side Kanban wrapper to fetch tasks and pass to KanbanBoard
"use client";
import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/lib/actions/tasks";
import { Loader2 } from "lucide-react";

import dynamic from "next/dynamic";
import { TaskWithTags } from "@/types/global";

const KanbanBoard = dynamic(
  () =>
    import("@/components/dashboard/kanban-board").then((m) => m.KanbanBoard),
  {
    loading: () => (
      <div className="flex justify-center items-center py-10">
        Loading Kanban Board...
      </div>
    ),
  }
);

export function ClientKanbanBoard({
  projectId,
  projectOwnerId,
}: {
  projectId: string;
  projectOwnerId: string;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full py-10">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  const tasks: TaskWithTags[] =
    data?.data.map((task) => ({
      ...task,
      taskMembers: task.TaskMembers,
      taskActivity: task.TaskActivity,
      taskMessage: task.TaskMessages,
    })) || [];

  return <KanbanBoard tasks={tasks} projectOwnerId={projectOwnerId} />;
}
