"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { ClientKanbanBoard } from "@/components/dashboard/client-kanban-board";
import ProjectTasksCalendar from "@/components/dashboard/project-tasks-calendar";
import React from "react";
import { TaskWithTags } from "@/types/global";

interface ProjectTasksTabsProps {
  projectId: string;
  projectOwnerId: string;
  tasks: TaskWithTags[];
}

export default function ProjectTasksTabs({
  projectId,
  projectOwnerId,
  tasks,
}: ProjectTasksTabsProps) {
  // Fix null -> undefined for description and dueDate
  // Ensure tasks shape matches TaskWithTags (description: string|null, dueDate: Date|null)
  const fixedTasks = (tasks || []).map((task) => ({
    ...task,
    description: task.description ?? null,
    dueDate: task.dueDate
      ? typeof task.dueDate === "string"
        ? new Date(task.dueDate)
        : task.dueDate
      : null,
  }));

  return (
    <div className="flex flex-col min-h-[90vh] w-full mx-auto p-1 gap-6">
      <h1 className="text-3xl font-bold mb-2 text-center">Project Tasks</h1>
      <Tabs
        defaultValue="kanban"
        className="w-full flex-1 flex flex-col shadow-xl overflow-hidden"
      >
        <TabsList className="flex gap-2">
          <TabsTrigger
            value="kanban"
            className="px-3 py-1 font-normal data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-colors"
          >
            Kanban Board
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="px-6 py-2 text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-colors"
          >
            Calendar View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="flex-1 min-h-[70vh] py-2">
          <ClientKanbanBoard
            projectId={projectId}
            projectOwnerId={projectOwnerId}
          />
        </TabsContent>
        <TabsContent value="calendar" className="flex-1 min-h-[70vh] py-2">
          <div className="h-[65vh] w-full">
            <ProjectTasksCalendar tasks={fixedTasks} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
