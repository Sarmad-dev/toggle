import { TimeEntryList } from "@/components/dashboard/time-entry-list";

// export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Time Entries</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your recent time entries
          </p>
        </div>
        <TimeEntryList />
      </div>
    </div>
  );
}