"use client";

import { useQuery } from "@tanstack/react-query";
import { getTimeEntries } from "@/lib/actions/time-entries";
import { useUser } from "@/hooks/use-user";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null;
  project: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  billable: boolean;
}

export function TimeEntryList() {
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: () => getTimeEntries(user?.id),
    enabled: !!user,
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "0h 0m";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const columns: ColumnDef<TimeEntry>[] = [
    {
      id: "project",
      accessorFn: (row) => row.project?.name ?? "No Project",
      header: "Project",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.project ? (
            <>
              <span
                className="mr-2 h-2 w-2 rounded-full"
                style={{
                  backgroundColor: row.original.project.color || "#000",
                }}
              />
              <span>{row.original.project.name}</span>
            </>
          ) : (
            <span className="text-muted-foreground">No Project</span>
          )}
        </div>
      ),
      filterFn: (row, id, value) => {
        return row.original.project?.name.toLowerCase().includes(value.toLowerCase()) || false;
      },
    },
    {
      accessorKey: "startTime",
      id: "date",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.startTime), "MMM dd, yyyy"),
    },
    {
      accessorKey: "startTime",
      id: "time",
      header: "Start Time",
      cell: ({ row }) => format(new Date(row.original.startTime), "HH:mm"),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          {formatDuration(row.original.duration)}
        </div>
      ),
    },
    {
      accessorKey: "billable",
      header: "Status",
      cell: ({ row }) =>
        row.original.billable && <Badge variant="secondary">Billable</Badge>,
    },
  ];

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
      columns={columns}
      data={data?.data || []}
      searchKey="project"
      pageSize={10}
    />
  );
}
