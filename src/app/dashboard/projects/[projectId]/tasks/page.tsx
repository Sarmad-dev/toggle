import { getProject } from "@/lib/actions/projects";
import queryClient from "@/lib/tanstack/queryClient";
import React from "react";
import { getProjectTasks } from "@/lib/actions/tasks";
import { TaskWithTags } from "@/types/global";
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
  const rawTasks = tasksResult?.data || [];

  // Transform to TaskWithTags
  const tasksWithTags: TaskWithTags[] = rawTasks.map((task) => ({
    ...task,
    taskMembers: task.TaskMembers,
    taskActivity: task.TaskActivity,
    TaskMessages: task.TaskMessages.map((msg) => ({
      ...msg,
      projectId,
    })),
  }));

  return (
    <ProjectTasksTabs
      projectId={projectId}
      projectOwnerId={project.data?.userId as string}
      tasks={tasksWithTags}
    />
  );
};
export default TasksPage;
