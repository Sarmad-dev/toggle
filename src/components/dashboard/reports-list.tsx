"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Clock, DollarSign, Users } from "lucide-react";

interface Report {
  title: string;
  description: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ReportsListProps {
  reports: Report[];
}

export function ReportsList({ reports }: ReportsListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {reports.map((report) => (
        <Card key={report.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {report.title}
            </CardTitle>
            <report.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.value}</div>
            <p className="text-xs text-muted-foreground">
              {report.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 