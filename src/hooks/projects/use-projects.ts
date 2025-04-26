"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/actions/projects";
import { useUser } from "../use-user";

export function useProjects() {
  const { user } = useUser();

  const { data: projects, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(user?.id as string),
    enabled: !!user,
  });

  return {
    projects,
    isLoading,
    isError,
    error,
    refetch
  }
} 