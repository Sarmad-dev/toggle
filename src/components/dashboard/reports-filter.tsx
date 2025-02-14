"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects, getAllTeams } from "@/lib/actions/reports";
import { Spinner } from "@/components/ui/spinner";

interface ReportsFilterProps {
  onFilterChange: (filter: {
    type: "projects" | "teams" | "billable";
    id?: string;
    chartType?: "bar" | "pie" | "line" | "area";
  }) => void;
}

export function ReportsFilter({ onFilterChange }: ReportsFilterProps) {
  const [filterType, setFilterType] = useState<
    "projects" | "teams" | "billable"
  >("billable");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [chartType, setChartType] = useState<"bar" | "pie" | "line" | "area">(
    "bar"
  );

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => getAllProjects(),
    enabled: filterType === "projects",
  });

  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ["all-teams"],
    queryFn: () => getAllTeams(),
    enabled: filterType === "teams",
  });

  useEffect(() => {
    onFilterChange({ type: filterType, id: selectedId, chartType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, selectedId, chartType]);

  return (
    <div className="flex flex-col gap-4">
      <Select
        value={filterType}
        onValueChange={(value) =>
          setFilterType(value as "projects" | "teams" | "billable")
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Report Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="projects">Projects</SelectItem>
          <SelectItem value="teams">Teams</SelectItem>
          <SelectItem value="billable">Billable Amount</SelectItem>
        </SelectContent>
      </Select>

      {(filterType === "projects" || filterType === "teams") && (
        <Select
          value={selectedId}
          onValueChange={(value) => setSelectedId(value)}
          disabled={
            (filterType === "projects" && projectsLoading) ||
            (filterType === "teams" && teamsLoading)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select a ${filterType.slice(0, -1)}`} />
          </SelectTrigger>
          <SelectContent>
            {(filterType === "projects" ? projects?.data : teams?.data)?.map(
              (item: { name: string; id: string }) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      )}

      {(filterType === "projects" && projectsLoading) ||
      (filterType === "teams" && teamsLoading) ? (
        <Spinner />
      ) : null}

      <Select
        value={chartType}
        onValueChange={(value) =>
          setChartType(value as "area" | "line" | "bar" | "pie")
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Chart Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bar">Bar Chart</SelectItem>
          <SelectItem value="pie">Pie Chart</SelectItem>
          <SelectItem value="line">Line Chart</SelectItem>
          <SelectItem value="area">Area Chart</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
