"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";
import { DataTable } from "@/components/ui/data-table";
import { Loader2 } from "lucide-react";
import { timeEntryColumns } from "./columns/TimeEntryColumns";
import { getUserProjectsTimeEntry } from "@/lib/actions/time-entries";

export function TimeEntryList() {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: async () => await getUserProjectsTimeEntry(user?.id as string),
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
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
