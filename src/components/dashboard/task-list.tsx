"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/lib/actions/tasks";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TaskPriority } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Play, Square, User, Calendar, Loader2 } from "lucide-react";
import { useTimerStore } from "@/stores/use-timer-store";
import { useUser } from "@/hooks/use-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus } from "@/lib/actions/tasks";
import { toast } from "sonner";
import { CreateTask } from "./create-task";
import { useProject } from "@/hooks/use-project";

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: string;
  dueDate: Date | null;
  priority: TaskPriority;
  projectId: string;
  assignedTo: string | null;
  assignedToAll: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
  } | null;
}

// const statusColors: Record<
//   TaskStatus,
//   "default" | "secondary" | "destructive" | "outline"
// > = {
//   TODO: "secondary",
//   IN_PROGRESS: "default",
//   COMPLETED: "outline",
// } as const;

const priorityColors = {
  LOW: "bg-blue-500/10 text-blue-500",
  MEDIUM: "bg-yellow-500/10 text-yellow-500",
  HIGH: "bg-red-500/10 text-red-500",
};

const statusOptions = ["TODO", "IN_PROGRESS", "COMPLETED"];

export function TaskList({ projectId }: { projectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });

  const { data: projectData } = useProject(projectId);

  const { user } = useUser();
  const { isRunning, selectedTaskId, startTask, stopTask } = useTimerStore();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result?.success) {
        toast.success("Task status updated");
      } else {
        toast.error(result?.error || "Failed to update task status");
      }
    } catch (error) {
      console.error("Failed to update Status: ", error)
      toast.error("Failed to update task status");
    }
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue(
          "priority"
        ) as keyof typeof priorityColors;
        return (
          <Badge className={priorityColors[priority]}>
            {priority.charAt(0) + priority.slice(1).toLowerCase()}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const date = row.getValue("dueDate") as Date | null;
        return date ? (
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            {format(new Date(date), "PPP")}
          </div>
        ) : (
          <span className="text-muted-foreground">No due date</span>
        );
      },
    },
    {
      accessorKey: "assignedTo",
      header: "Assigned To",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {task.assignedToAll
              ? "All Members"
              : task.user?.username || "Unassigned"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const task = row.original;
        const canChangeStatus =
          task.assignedTo === user?.id || task.assignedToAll;

        return canChangeStatus ? (
          <Select
            value={task.status}
            onValueChange={(value) => handleStatusChange(task.id, value)}
          >
            <SelectTrigger>
              <SelectValue>{task.status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span>{task.status}</span>
        );
      },
    },
    {
      id: "timer",
      cell: ({ row }) => {
        const task = row.original;
        const canManageTimer =
          task.assignedTo === user?.id || task.assignedToAll;
        const isTaskRunning = isRunning && selectedTaskId === task.id;

        if (!canManageTimer) return null;

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (isTaskRunning ? stopTask() : startTask(task.id))}
            disabled={isRunning && selectedTaskId !== task.id}
          >
            {isTaskRunning ? (
              <Square className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
  ];

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
        columns={columns}
        data={data?.data || []}
        searchKey="name"
        pageSize={5}
      />
    </>
  );
}
