"use client";

import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/actions/user";

export function useUser() {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUser(),
    staleTime: Infinity,
  });

  return {
    user,
    isLoading,
    isError,
    error,
    refetch,
  };
}
