"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) {
        queryClient.clear();
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    staleTime: 0,
    retry: false,
  });

  return {
    user,
    isLoading,
  };
} 