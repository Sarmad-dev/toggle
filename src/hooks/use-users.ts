"use client";

import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  email: string;
}

export function useUsers() {
  return useQuery<{ success: boolean; data: User[] }>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
} 