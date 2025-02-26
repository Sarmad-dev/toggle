import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CircleDollarSign,
  Clock,
  PlayCircle,
  StopCircle,
  MoreVertical,
} from "lucide-react";
import { useTimerStore } from "@/stores/use-timer-store";
import { useUser } from "@/hooks/use-user";
import { Project } from "@/types/global";

export const useProjectColumns = () => {
  const { isRunning, selectedProjectId, start, stop } = useTimerStore();
  const { user } = useUser();

  const projectColumns: ColumnDef<Project>[] = [
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
                stop();
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
            <Link
              href={`/dashboard/projects/${project.id}`}
              className="font-medium hover:underline"
            >
              {project.name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "team",
      header: "Team",
      cell: ({ row }) => {
        const team = row.original.team;
        return team ? (
          <Badge variant="outline">{team.name}</Badge>
        ) : (
          <span className="text-muted-foreground">No team assigned</span>
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
      cell: ({ row }) => `${row.original._count.tasks} tasks`,
    },
    {
      accessorKey: "timeEntries",
      header: "Total Hours",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          {formatDuration(row.original._count.timeEntries)}
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
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                  View Project
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return {projectColumns}
};
