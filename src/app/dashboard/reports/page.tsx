"use client";

import React, { useState, useEffect } from "react";
import {
  getTimeTrackingStats,
  getBillableAmount,
  getTotalMembers,
  getTotalProjectsCurrentMonth,
  getFilteredReportData,
  getAllProjects,
  getAllTeams,
} from "@/lib/actions/reports";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { ReportsList } from "@/components/dashboard/reports-list";
import { ReportsFilter } from "@/components/dashboard/reports-filter";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { Spinner } from "@/components/ui/spinner";
import { Clock, DollarSign, Users, BarChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface Report {
  title: string;
  description: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const downloadAsPDF = async (elementId: string, title: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Wait for charts to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      scale: 2, // Increase quality
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = pdfWidth;
    const imgHeight = pdfWidth * aspectRatio;

    // Add title
    pdf.setFontSize(20);
    pdf.text(title, 20, 20);

    // Add timestamp
    pdf.setFontSize(12);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);

    // Add the chart image
    pdf.addImage(imgData, 'PNG', 0, 60, imgWidth, imgHeight);

    pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF');
  }
};

export default function ReportsPage() {
  const { user, isLoading: userLoading } = useUser();
  const [filter, setFilter] = useState<{ type: "projects" | "teams" | "billable"; id?: string; chartType?: "bar" | "pie" | "line" | "area" }>({ type: "billable" });
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: timeStats,
    isLoading: timeLoading,
    error: timeError,
  } = useQuery({
    queryKey: ["time-tracking-stats"],
    queryFn: () => getTimeTrackingStats(user?.id!),
    enabled: !!user,
  });

  const {
    data: billableStats,
    isLoading: billableLoading,
    error: billableError,
  } = useQuery({
    queryKey: ["billable-amount"],
    queryFn: () => getBillableAmount(user?.id!),
    enabled: !!user,
  });

  const {
    data: membersStats,
    isLoading: membersLoading,
    error: membersError,
  } = useQuery({
    queryKey: ["total-members"],
    queryFn: () => getTotalMembers(user?.id!),
    enabled: !!user,
  });

  const {
    data: projectsStats,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["total-projects-current-month"],
    queryFn: () => getTotalProjectsCurrentMonth(user?.id!),
    enabled: !!user,
  });

  const {
    data: projects,
  } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => getAllProjects(),
    enabled: !!user,
  });

  const {
    data: teams,
  } = useQuery({
    queryKey: ["all-teams"],
    queryFn: () => getAllTeams(),
    enabled: !!user,
  });

  const handleFilterChange = (newFilter: { type: "projects" | "teams" | "billable"; id?: string; chartType?: "bar" | "pie" | "line" | "area" }) => {
    setFilter(newFilter);
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const data = await getFilteredReportData(filter);
        setChartData(data);
      } catch (error) {
        console.error("Error fetching filtered report data:", error);
        toast.error("Failed to load filtered reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [filter]);

  const assembleReports = (): Report[] => {
    return [
      {
        title: "Time Tracked",
        description: "Total hours tracked this month",
        value: timeStats?.data?.totalHours ? `${timeStats.data.totalHours}h` : "0h",
        icon: Clock,
      },
      {
        title: "Revenue",
        description: "Total billable amount this month",
        value: billableStats?.data?.totalBillableAmount ? `$${billableStats.data.totalBillableAmount.toFixed(2)}` : "$0.00",
        icon: DollarSign,
      },
      {
        title: "Team Activity",
        description: "Total unique members involved",
        value: membersStats?.data?.totalMembers ? `${membersStats.data.totalMembers} members` : "0 members",
        icon: Users,
      },
      {
        title: "Projects",
        description: "Total projects this month",
        value: projectsStats?.data?.totalProjectsCurrentMonth ? `${projectsStats.data.totalProjectsCurrentMonth} projects` : "0 projects",
        icon: BarChart,
      },
    ];
  };

  const reports = assembleReports();

  const { type: filterType, id: filterId, chartType } = filter;

  if (
    userLoading ||
    timeLoading ||
    billableLoading ||
    membersLoading ||
    projectsLoading
  ) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (timeError || billableError || membersError || projectsError) {
    toast.error("Failed to load reports");
    return null;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button
          onClick={() => downloadAsPDF('report-container', 'Time Tracking Report')}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      
      <div id="report-container">
        <div className="px-8">
          <ReportsList data={timeStats?.data!} />
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Filtered Reports</h2>
            <div className="mb-4 text-sm text-muted-foreground">
              <p>
                Report Type: {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterId && (filterType === "projects" || filterType === "teams") && (
                  <> | {filterType === "projects" ? "Project" : "Team"}: {
                    filterType === "projects" 
                      ? projects?.data?.find((p: any) => p.id === filterId)?.name 
                      : teams?.data?.find((t: any) => t.id === filterId)?.name
                  }</>
                )}
                {chartType && <> | Chart Type: {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</>}
              </p>
            </div>
          </div>

          {isLoading ? (
            <Spinner />
          ) : chartData ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filterType === "billable" && chartType === "pie" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">Billable Amount</h3>
                  <Pie
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Billable Amount",
                          data: chartData.values,
                          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                          hoverOffset: 4,
                        },
                      ],
                    }}
                  />
                </div>
              )}

              {filterType === "billable" && chartType === "bar" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">Billable Amount</h3>
                  <Bar
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Billable Amount",
                          data: chartData.values,
                          backgroundColor: "#36A2EB",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: "Billable Amount",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {filterType === "billable" && chartType === "line" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">Billable Amount</h3>
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Billable Amount",
                          data: chartData.values,
                          backgroundColor: "#36A2EB",
                          borderColor: "#36A2EB",
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: "Billable Amount",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {(filterType === "projects" || filterType === "teams") && chartType === "bar" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">
                    {filterType === "projects" ? "Project Time Tracked" : "Team Time Tracked"}
                  </h3>
                  <Bar
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Hours Tracked",
                          data: chartData.values,
                          backgroundColor: "#36A2EB",
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: filterType === "projects" ? "Time Tracked per Project" : "Time Tracked per Team",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {(filterType === "projects" || filterType === "teams") && chartType === "pie" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">
                    {filterType === "projects" ? "Project Time Tracked" : "Team Time Tracked"}
                  </h3>
                  <Pie
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Hours Tracked",
                          data: chartData.values,
                          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                          hoverOffset: 4,
                        },
                      ],
                    }}
                  />
                </div>
              )}

              {(filterType === "projects" || filterType === "teams") && chartType === "line" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">
                    {filterType === "projects" ? "Project Time Tracked" : "Team Time Tracked"}
                  </h3>
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Hours Tracked",
                          data: chartData.values,
                          backgroundColor: "#36A2EB",
                          borderColor: "#36A2EB",
                          fill: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: filterType === "projects" ? "Time Tracked per Project" : "Time Tracked per Team",
                        },
                      },
                    }}
                  />
                </div>
              )}

              {(filterType === "projects" || filterType === "teams") && chartType === "area" && (
                <div className="bg-background p-4 rounded-md shadow">
                  <h3 className="text-lg font-medium mb-2">
                    {filterType === "projects" ? "Project Time Tracked" : "Team Time Tracked"}
                  </h3>
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: "Hours Tracked",
                          data: chartData.values,
                          backgroundColor: "rgba(54, 162, 235, 0.2)",
                          borderColor: "#36A2EB",
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: filterType === "projects" ? "Time Tracked per Project" : "Time Tracked per Team",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No data available for the selected filter.</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <ReportsFilter onFilterChange={handleFilterChange} />
      </div>
    </div>
  );
}

