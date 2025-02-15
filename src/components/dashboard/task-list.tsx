"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/lib/actions/tasks";
import { DataTable } from "@/components/ui/data-table";
import { CreateTask } from "./create-task";
import { useProject } from "@/hooks/use-project";
import { Loader2 } from "lucide-react";
import { useTaskColumns } from "./columns/TaskColumns";

export function TaskList({ projectId }: { projectId: string }) {
  const { taskColumns } = useTaskColumns();
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });

  const { data: projectData } = useProject(projectId);

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <CreateTask
          projectId={projectId}
          managerId={projectData?.data?.managerId as string}
        />
      </div>
      <DataTable
        columns={taskColumns}
        data={data?.data || []}
        searchKey="name"
        pageSize={10}
      />
    </>
  );
}
