"use client";

import { getUsers } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  const {
    data: users,
    isError,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-users"],
    queryFn: getUsers,
  });

  return { users, isError, error, isLoading, refetch };
}
