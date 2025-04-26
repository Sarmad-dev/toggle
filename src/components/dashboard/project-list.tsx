"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Project } from "@/types/global";
import { useProjectColumns } from "./columns/ProjectColumns";
import { getProjects } from "@/lib/actions/projects";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import ProjectLoader from "../loaders/project-loader";

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
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <ProjectLoader />
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

  // Check if there are no projects
  if (!projects?.data || projects.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[450px] w-full">
        <div className="relative w-[430px] h-[450px]">
          <Image
            src="/assets/no-projects.svg"
            alt="No projects"
            fill
            priority
            className="object-contain"
          />
        </div>
        <p className="text-muted-foreground mt-4">Create your first project to get started</p>
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
