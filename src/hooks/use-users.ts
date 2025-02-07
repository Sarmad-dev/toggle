"use client";

import { getUsers } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getUsers();
      return users;
    },
  });

  return { data, isLoading, error };
} 