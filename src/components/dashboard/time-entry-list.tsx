"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { DataTable } from "@/components/ui/data-table";
import { timeEntryColumns } from "./columns/TimeEntryColumns";
import { getUserProjectsTimeEntry } from "@/lib/actions/time-entries";
import { Spinner } from "../ui";

export function TimeEntryList() {
  const { user, isLoading: userLoading } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: async () => await getUserProjectsTimeEntry(user?.id as string),
    enabled: !!user,
  });

  if (isLoading || userLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div>Error loading time entries</div>;
  }

  return (
    <DataTable
      columns={timeEntryColumns}
      data={data?.data || []}
      searchKey="project"
      pageSize={10}
    />
  );
}
