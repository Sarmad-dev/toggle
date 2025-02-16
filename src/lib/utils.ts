import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

export const formatDuration = (seconds: number | null) => {
  if (!seconds) return "0h 0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

export function addOneMonthClamped(date: Date) {
  const newDate = new Date(date);
  const originalDate = newDate.getDate(); // Save original day
  newDate.setMonth(newDate.getMonth() + 1); // Add 1 month
  
  // Check if the day changed due to month overflow
  if (newDate.getDate() !== originalDate) {
    newDate.setDate(0); // Set to last day of the previous month (target month)
  }
  return newDate;
}