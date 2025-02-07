"use client";

import { getProjects } from "@/lib/actions/projects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Clock, Loader2, PlayCircle, StopCircle } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTimerStore } from "@/stores/use-timer-store";
import { cn } from "@/lib/utils";

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

  const formatDuration = (timeEntries: { duration: number }[]) => {
    const totalSeconds = timeEntries.reduce(
      (acc, entry) => acc + entry.duration,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}m`;
  };

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Timer</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Total Hours</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects?.data?.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
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
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <span
                    className="mr-2 h-2 w-2 rounded-full"
                    style={{ backgroundColor: project.color || "#000" }}
                  />
                  {project.name}
                </div>
              </TableCell>
              <TableCell>{project.client?.name || "No Client"}</TableCell>
              <TableCell>{project.tasks.length} tasks</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatDuration(project.timeEntries as { duration: number }[])}
                </div>
              </TableCell>
              <TableCell>
                {project.billable && (
                  <Badge variant="secondary">
                    <CircleDollarSign className="mr-1 h-3 w-3" />
                    Billable
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
