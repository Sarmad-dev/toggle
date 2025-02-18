"use client";

import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types/global";

export function useUser() {

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("/api/user");
      if (!response.ok) return null;
      return response.json();
    },
    staleTime: Infinity,
  });

  return {
    user: user || null,
    isLoading,
  };
} 