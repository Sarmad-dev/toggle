"use client";

import { getProjects } from "@/lib/actions/projects";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Clock, Loader2, PlayCircle, StopCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/stores/use-timer-store";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface Project {
  id: string;
  name: string;
  color: string | null;
  client: { 
    id: string;
    name: string;
    // ... other client fields
  } | null;
  tasks: any[];
  timeEntries: {
    id: string;
    duration: number | null;
    // ... other timeEntry fields
  }[];
  billable: boolean;
}

export function ProjectList() {
  const { user } = useUser();
  const { isRunning, selectedProjectId, start, stop } = useTimerStore();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user?.id),
    enabled: !!user,
  });

  const formatDuration = (timeEntries: { duration: number | null }[]) => {
    const totalSeconds = timeEntries.reduce(
      (acc, entry) => acc + (entry.duration || 0),
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const columns: ColumnDef<Project>[] = [
    {
      id: "timer",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              isRunning && selectedProjectId === project.id && "text-destructive"
            )}
            onClick={() => {
              if (isRunning && selectedProjectId === project.id) {
                stop(user?.id);
              } else {
                start(project.id);
              }
            }}
            disabled={!user}
          >
            {isRunning && selectedProjectId === project.id ? (
              <StopCircle className="h-4 w-4" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <div className="flex items-center">
            <span
              className="mr-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: project.color || "#000" }}
            />
            {project.name}
          </div>
        );
      },
    },
    {
      accessorKey: "client.name",
      header: "Client",
      cell: ({ row }) => row.original.client?.name || "No Client",
    },
    {
      accessorKey: "tasks",
      header: "Tasks",
      cell: ({ row }) => `${row.original.tasks.length} tasks`,
    },
    {
      accessorKey: "timeEntries",
      header: "Total Hours",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          {formatDuration(row.original.timeEntries)}
        </div>
      ),
    },
    {
      accessorKey: "billable",
      header: "Status",
      cell: ({ row }) =>
        row.original.billable && (
          <Badge variant="secondary">
            <CircleDollarSign className="mr-1 h-3 w-3" />
            Billable
          </Badge>
        ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error fetching projects</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={projects?.data || []}
      searchKey="name"
      pageSize={8}
    />
  );
}
