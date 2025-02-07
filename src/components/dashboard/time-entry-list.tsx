"use client";

import { useEffect, useState } from "react";
import { getTimeEntries } from "@/lib/actions/time-entries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Clock, Folder } from "lucide-react";

type TimeEntry = {
  id: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  project: {
    name: string;
  } | null;
  task: {
    name: string;
  } | null;
};

export function TimeEntryList() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  useEffect(() => {
    async function fetchEntries() {
      // TODO: Replace with actual user ID
      const result = await getTimeEntries("user_id");
      if (result?.success) {
        setEntries(result?.data as unknown as TimeEntry[]);
      }
    }
    fetchEntries();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.description}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  {entry.project?.name || "No Project"}
                </div>
              </TableCell>
              <TableCell>{format(new Date(entry.startTime), "PPp")}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatDuration(entry.duration)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 