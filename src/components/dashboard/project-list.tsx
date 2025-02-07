"use client";

import { useEffect, useState } from "react";
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
import { CircleDollarSign, Clock, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";

type Project = {
  id: string;
  name: string;
  description: string | null;
  billable: boolean;
  hourlyRate: number | null;
  client: { name: string } | null;
  tasks: { id: string }[];
  timeEntries: { duration: number }[];
};

export function ProjectList() {
  const { user } = useUser();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user),
  });

  const getTotalHours = (timeEntries: { duration: number }[]) => {
    const totalSeconds = timeEntries.reduce(
      (acc, entry) => acc + entry.duration,
      0
    );
    return (totalSeconds / 3600).toFixed(1);
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
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>{project.client?.name || "No Client"}</TableCell>
              <TableCell>{project.tasks.length} tasks</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {getTotalHours(project.timeEntries as { duration: number }[])}h
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
