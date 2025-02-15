import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { TimeEntryColumn } from "@/types/global";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Clock } from "lucide-react";

export const timeEntryColumns: ColumnDef<TimeEntryColumn>[] = [
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
    filterFn: (row, value) => {
      return (
        row.original.project?.name
          .toLowerCase()
          .includes(value.toLowerCase()) || false
      );
    },
  },
  {
    accessorKey: "startTime",
    id: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.startTime), "MMM dd, yyyy"),
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
