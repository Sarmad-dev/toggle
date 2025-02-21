"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, Bar, Bubble } from "react-chartjs-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ReportData } from "@/types/global";
import ReportCard from "./reports/ReportCard";
import { assembleReports, chartData, chartOptions } from "@/lib/constants";
import { months } from "@/lib/utils";

interface ReportsListProps {
  data: ReportData;
}

export function ReportsList({ data }: ReportsListProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return format(new Date(), "yyyy-MM");
  });
  const [chartType, setChartType] = useState<"line" | "bar" | "bubble">("line");

  const ChartComponent =
    chartType === "line" ? Line : chartType === "bubble" ? Bubble : Bar;

  const reports = assembleReports(data);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            icon={<report.icon className="h-4 w-4 text-muted-foreground" />}
            description={report.description}
            content={report.value.toString()}
          />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Time Tracking Analysis</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={chartType === "line" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                Line
              </Button>
              <Button
                variant={chartType === "bar" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                Bar
              </Button>
              <Button
                variant={chartType === "bubble" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChartType("bubble")}
              >
                Bubble
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartComponent data={chartData(data)} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
