"use client";

import { getProjectMembers } from "@/lib/actions/projects";
import { useQuery } from "@tanstack/react-query";

export function useProjectMembers(projectId: string) {
  const {
    data: projectMembers,
    isError,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-project-members", projectId],
    queryFn: async () => await getProjectMembers(projectId),
  });

  return {
    projectMembers,
    isError,
    error,
    isLoading,
    refetch,
  };
}
