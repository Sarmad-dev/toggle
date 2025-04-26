"use client";

import { useQuery } from "@tanstack/react-query";
import { useGetOrganization } from "./use-get-organization";
import { getOrganizationMember } from "@/lib/actions/organization";

export const useGetOrganizationMembers = () => {
  const { organization } = useGetOrganization();

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["organization-members", organization?.data?.id],
    queryFn: () => getOrganizationMember(organization?.data?.id as string),
  });

  return {
    members: data?.data,
    isError,
    error,
    isLoading,
    refetch,
  };
};
