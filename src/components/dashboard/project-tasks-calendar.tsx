"use client";
import React from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Event,
} from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { TaskWithTags } from "@/types/global";
import TaskDetail from "../TaskDetail";

const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface ProjectTasksCalendarProps {
  tasks: TaskWithTags[];
}

export default function ProjectTasksCalendar({
  tasks,
}: ProjectTasksCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<TaskWithTags | null>(
    null
  );

  // Convert tasks with a due date to calendar events
  const events: Event[] = (tasks || [])
    .filter((task) => !!task.dueDate)
    .map((task) => ({
      id: task.id,
      title: task.name,
      start: new Date(task.dueDate!),
      end: new Date(task.dueDate!),
      allDay: true,
      resource: task,
    }));

  const handleCardClick = (task: TaskWithTags) => {
    setSelectedTask(task);
    setOpen(true);
  };

  return (
    <>
      <TaskDetail open={open} setOpen={setOpen} selectedTask={selectedTask} />
      <div className="relative h-full w-full flex flex-col bg-background rounded-xl shadow-xl overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          onSelectEvent={(event) => {
            handleCardClick(event.resource);
          }}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          popup
          toolbar
          views={["month", "week", "day"]}
          className="rbc-material"
          components={{
            event: ({ event }) => (
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg font-medium bg-blue-600 text-white shadow hover:bg-blue-700 cursor-pointer transition-colors text-xs">
                <span className="truncate">{event.title}</span>
              </div>
            ),
          }}
        />
        <style jsx global>{`
          .rbc-material {
            font-family: "Inter", "Roboto", Arial, sans-serif;
            background: var(--background);
          }
          .rbc-material .rbc-toolbar {
            background: transparent;
            color: var(--foreground);
            padding: 0.5rem 1rem 0.5rem 1rem;
            border-radius: 0;
            box-shadow: none;
            margin-bottom: 0.5rem;
          }
          .rbc-material .rbc-btn-group button {
            background: transparent;
            border: none;
            color: var(--primary);
            font-weight: 500;
            font-size: 1rem;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            transition: background 0.15s;
          }
          .rbc-material .rbc-btn-group button.rbc-active,
          .rbc-material .rbc-btn-group button:focus {
            background: var(--primary);
            color: var(--primary-foreground);
          }
          .rbc-material .rbc-month-view {
            border: none;
            display: flex;
            gap: 2px;
            box-shadow: none;
          }
          .rbc-material .rbc-header {
            background: transparent;
            border: none;
            color: var(--foreground);
            font-size: 1rem;
            font-weight: 600;
            padding-bottom: 0.25rem;
          }
          .rbc-material .rbc-month-row {
            border: none;
          }
          .rbc-material .rbc-date-cell {
            padding: 0.5rem 0.5rem 0.25rem 0.5rem;
            color: var(--foreground);
            font-size: 0.95rem;
            font-weight: 500;
          }
          .rbc-material .rbc-day-bg {
            border: 1px solid var(--muted);
            border-radius: 0.6rem;
            background: transparent;
            transition: background 0.15s, box-shadow 0.15s;
          }
          .rbc-material .rbc-day-bg:hover {
            background: var(--muted);
            box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
          }
          .rbc-material .rbc-today {
            background: #e3f2fd;
            border-radius: 0.6rem;
            border: 1.5px solid var(--primary);
          }
          .rbc-material .rbc-off-range-bg {
            background: transparent;
          }
          .rbc-material .rbc-event {
            background-color: #1976d2;
            color: #fff;
            border-radius: 0.7rem;
            border: none;
            font-weight: 500;
            box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.12);
            padding: 2px 8px;
            font-size: 0.95rem;
            margin: 1px 0;
          }
          .rbc-material .rbc-event.rbc-selected {
            background-color: #1565c0;
          }
          .rbc-material .rbc-selected {
            background: #1565c0;
          }
          .rbc-material .rbc-off-range {
            color: #b0b0b0;
          }
          .rbc-material .rbc-month-header {
            border: none;
          }
          .rbc-material .rbc-row-segment {
            padding: 1px 0;
          }
          .rbc-material .rbc-agenda-view table,
          .rbc-material .rbc-agenda-view tbody,
          .rbc-material .rbc-agenda-view tr,
          .rbc-material .rbc-agenda-view td {
            border: none;
          }
          .dark .rbc-material .rbc-toolbar,
          .dark .rbc-material .rbc-month-view,
          .dark .rbc-material .rbc-time-view {
            background: #18181b;
            color: #f4f4f5;
          }
          .dark .rbc-material .rbc-event {
            background-color: #1976d2;
            color: #fff;
          }
          .dark .rbc-material .rbc-today {
            background: #232b38;
            border: 1.5px solid #1976d2;
          }
          .dark .rbc-material .rbc-off-range {
            color: #71717a;
          }
          .dark .rbc-material .rbc-header {
            color: #f4f4f5;
          }
        `}</style>
      </div>
    </>
  );
}
