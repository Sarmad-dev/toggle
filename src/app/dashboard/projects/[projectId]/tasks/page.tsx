import { getProject } from "@/lib/actions/projects";
import queryClient from "@/lib/tanstack/queryClient";
import React from "react";
import { getProjectTasks } from "@/lib/actions/tasks";
import { Task } from "@prisma/client";
import ProjectTasksTabs from "@/components/dashboard/project-tasks-tabs";

type Props = {
  params: Promise<{ projectId: string }>;
};

const TasksPage = async ({ params }: Props) => {
  const { projectId } = await params;

  const project = await queryClient.fetchQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });
  const tasksResult = await queryClient.fetchQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });
  const tasks = tasksResult?.data || [];

  return (
    <ProjectTasksTabs
      projectId={projectId}
      projectOwnerId={project.data?.userId as string}
      tasks={tasks as Task[]}
    />
  );
};
export default TasksPage;
