import React from 'react';
import { ReportsList } from "./reports-list";
import { Bar, Pie, Line } from "react-chartjs-2";
import { ReportData, ChartData } from '@/types/global';

interface ReportPDFContentProps {
  reports: ReportData;
  chartData: ChartData;
  filterType: string;
  chartType: string;
}

export function ReportPDFContent({
  reports,
  chartData,
  filterType,
  chartType,
}: ReportPDFContentProps) {
  return (
    <div className="p-8 bg-white">
      <h1 className="text-3xl font-bold mb-6">Time Tracking Report</h1>
      <div className="mb-8">
        <ReportsList data={reports} />
      </div>
      
      {chartData && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">
            {filterType === "projects" 
              ? "Project Time Tracked" 
              : filterType === "teams"
              ? "Team Time Tracked"
              : "Billable Amount"}
          </h2>
          
          {/* Chart will be rendered here based on type */}
          <div className="w-full h-[400px]">
            {chartType === "bar" && (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
            {chartType === "pie" && (
              <Pie
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
            {chartType === "line" && (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        Generated on: {new Date().toLocaleString()}
      </div>
    </div>
  );
} 