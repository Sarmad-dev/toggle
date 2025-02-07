import { ReportsList } from "@/components/dashboard/reports-list";

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      </div>
      <ReportsList />
    </div>
  );
} 