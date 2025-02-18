import { ReportData } from "@/types/global";
import { clsx, type ClassValue } from "clsx";
import { format, subMonths } from "date-fns";
import { twMerge } from "tailwind-merge";
import { chatConfig } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0h 0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export function addOneMonthClamped(date: Date | string | number) {
  // Handle invalid/empty dates
  if (!date || Number.isNaN(new Date(date).getTime())) {
    return new Date(); // Fallback to current date
  }
  
  const newDate = new Date(date);
  const originalDate = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + 1);

  if (newDate.getDate() !== originalDate) {
    newDate.setDate(0);
  }
  return newDate;
}

export const months = Array.from({ length: 12 }, (_, i) => {
  const date = subMonths(new Date(), i);
  return {
    value: format(date, "yyyy-MM"),
    label: format(date, "MMMM yyyy"),
  };
});

export const filteredEntries = (data: ReportData) => {
  const selectedMonth = format(new Date(), "yyyy-MM");
  return data.timeEntries.filter((entry) => {
    return entry.date.startsWith(selectedMonth);
  });
};

// Add chat utilities
export const getFileIcon = (fileType: string) => {
  const { fileIcons } = chatConfig;
  const iconKey = Object.keys(fileIcons).find(key => fileType.includes(key)) || 'default';
  return fileIcons[iconKey as keyof typeof fileIcons];
};

export const formatMessageDate = (date: Date) => format(date, "p");
