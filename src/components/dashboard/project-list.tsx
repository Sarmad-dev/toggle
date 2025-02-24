"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { Project } from "@/types/global";
import { useProjectColumns } from "./columns/ProjectColumns";
import { getProjects } from "@/lib/actions/projects";
import { useUser } from "@/hooks/use-user";

export function ProjectList() {
  const { projectColumns } = useProjectColumns();
  const { user, isLoading: userLoading } = useUser();

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-projects"],
    queryFn: async () => await getProjects(user?.id as string),
    enabled: !!user,
  });

  if (isLoading || userLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="animate-spin" size={32} />
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
      data={projects?.data as Project[] || []}
      searchKey="name"
      pageSize={10}
    />
  );
}
