import { TimeEntryList } from "@/components/dashboard/time-entry-list";
import { getTimeEntries } from "@/lib/actions/time-entries";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Time Entries</h2>
      </div>
      <TimeEntryList />
    </div>
  );
}