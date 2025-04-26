"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "../use-user";
import { getOrganizationByUserId } from "@/lib/actions/organization";

export const useGetOrganization = () => {
  const { user } = useUser();

  const {
    data: organization,
    isError,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["get-organization"],
    queryFn: async () => getOrganizationByUserId(user?.id as string),
    enabled: !!user,
  });

  return {
    organization,
    isError,
    error,
    isLoading,
    refetch,
  };
};
