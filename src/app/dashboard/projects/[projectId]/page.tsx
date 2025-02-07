import { CreateTask } from "@/components/dashboard/create-task";
import { TaskList } from "@/components/dashboard/task-list";

export default function ProjectDetailPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <CreateTask projectId={params.projectId} />
      </div>
      <TaskList projectId={params.projectId} />
    </div>
  );
} 