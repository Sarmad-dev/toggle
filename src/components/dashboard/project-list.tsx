"use client";

import { getProjects } from "@/lib/actions/projects";
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { Project } from "@/types/global";
import { useProjectColumns } from "./columns/ProjectColumns";

export function ProjectList() {
  const { user } = useUser();
  const { projectColumns } = useProjectColumns()

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user?.id),
    enabled: !!user,
    initialData: { success: true, data: [] }
  });

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
      columns={projectColumns}
      data={projects?.data as Project[]}
      searchKey="name"
      pageSize={10}
    />
  );
}
