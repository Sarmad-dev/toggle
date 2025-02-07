"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Clock, DollarSign, Users } from "lucide-react";

const reports = [
  {
    title: "Time Tracked",
    description: "Total hours tracked this month",
    value: "164h 20m",
    icon: Clock,
  },
  {
    title: "Revenue",
    description: "Total billable amount this month",
    value: "$3,240",
    icon: DollarSign,
  },
  {
    title: "Team Activity",
    description: "Active team members this week",
    value: "8 members",
    icon: Users,
  },
  {
    title: "Projects",
    description: "Active projects this month",
    value: "12 projects",
    icon: BarChart,
  },
];

export function ReportsList() {
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