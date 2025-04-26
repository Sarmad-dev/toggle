"use client";

import { DataTable } from "@/components/ui/data-table";
import { timeEntryColumns } from "./columns/TimeEntryColumns";
import Image from "next/image";
import TimerLoader from "../loaders/timer-loader";
import { useGetUserProjectsTimeEntries } from "@/hooks/timer-entry/use-get-user-projects-time-entries";

export function TimeEntryList() {

  const { 
    timeEntries,
    isTimeEntriesLoading,
    isTimeEntriesError,
    timeEntriesError,
  } = useGetUserProjectsTimeEntries()

  if (isTimeEntriesLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <TimerLoader />
      </div>
    );
  }

  if (timeEntries?.data.length === 0) {
    return (
      <div className="w-full flex justify-center">
        <div className="h-[450px] w-[430px] relative flex items-center justify-center">
          <Image
            className="object-contain"
            src="/assets/no-entries.svg"
            width={430}
            height={450}
            alt="No time entries illustration"
          />
        </div>
      </div>
    );
  }

  if (isTimeEntriesError) {
    return <div>Error loading time entries, `${timeEntriesError?.message}`</div>;
  }

  return (
    <DataTable
      columns={timeEntryColumns}
      data={timeEntries?.data || []}
      searchKey="project"
      pageSize={10}
    />
  );
}
