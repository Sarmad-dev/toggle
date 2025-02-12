"use client";

import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/actions/projects";

export function useProject(projectId: string) {

  return useQuery({
    queryKey: ["project"],
    queryFn: () => getProject(projectId),
  });
} 