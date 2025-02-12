"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/actions/projects";
import { useUser } from "./use-user";

export function useProjects() {
  const { user } = useUser();

  return useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user?.id),
    enabled: !!user,
  });
} 