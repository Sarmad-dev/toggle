"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "@/lib/actions/tasks";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TaskStatus, Priority } from "@prisma/client";

interface Task {
  id: string;
  name: string;
  description: string | null;
  status: TaskStatus;
  deadline: Date | null;
  priority: Priority;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

const statusColors: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
  TODO: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "outline",
} as const;

export function TaskList({ projectId }: { projectId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "name",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusColors[row.original.status]}>
          {row.original.status.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Due Date",
      cell: ({ row }) =>
        row.original.deadline
          ? format(new Date(row.original.deadline), "MMM dd, yyyy")
          : "No due date",
    },
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={columns}
      data={data?.data || []}
      searchKey="title"
      pageSize={5}
    />
  );
} 