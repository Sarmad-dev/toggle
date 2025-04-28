"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { TaskWithTags } from "@/types/global";
import { useUser } from "@/hooks/use-user";
import { updateTaskStatus } from "@/lib/actions/tasks";
import { toast } from "sonner";

const COLUMN_ORDER = ["DRAFT", "TODO", "IN_PROGRESS", "COMPLETED"];
const COLUMN_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

interface KanbanBoardProps {
  tasks: TaskWithTags[];
  projectOwnerId: string;
}

export function KanbanBoard({ tasks, projectOwnerId }: KanbanBoardProps) {
  const { user } = useUser();
  const [columns, setColumns] = useState(() => {
    const grouped: Record<string, TaskWithTags[]> = {
      DRAFT: [],
      TODO: [],
      IN_PROGRESS: [],
      COMPLETED: [],
    };
    tasks.forEach((task) => {
      grouped[task.status]?.push(task);
    });
    return grouped;
  });

  const sensors = useSensors(useSensor(PointerSensor));

  // Permission: owner can move any, member only their own assigned
  const canDrag = (task: TaskWithTags) => {
    if (!user) return false;
    if (user.id === projectOwnerId) return true;
    return (
      task.taskMembers?.some((u) => u.userId === user.id) || task.assignedToAll
    );
  };

  //@typescript-eslint/no-explicit-any

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const [fromCol, fromIdx] = String(active.id).split(":");
    const [toCol, toIdx] = String(over.id).split(":");
    if (fromCol === toCol) {
      // Reorder within column
      setColumns((prev) => {
        const newCol = arrayMove(prev[fromCol], Number(fromIdx), Number(toIdx));
        return { ...prev, [fromCol]: newCol };
      });
    } else {
      // Move between columns
      setColumns((prev) => {
        const fromTasks = [...prev[fromCol]];
        const [moved] = fromTasks.splice(Number(fromIdx), 1);
        const toTasks = [...prev[toCol]];
        toTasks.splice(Number(toIdx), 0, { ...moved, status: toCol });
        return { ...prev, [fromCol]: fromTasks, [toCol]: toTasks };
      });
      // Persist status change
      const task = columns[fromCol][Number(fromIdx)];
      try {
        const result = await updateTaskStatus(
          task.id,
          toCol as "DRAFT" | "TODO" | "IN_PROGRESS" | "COMPLETED"
        );
        if (!result?.success) {
          toast.error(result?.error || "Failed to update task status");
        } else {
          toast.success("Task status updated");
        }
      } catch {
        toast.error("Failed to update task status");
      }
    }
    // TODO: Persist order if needed
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto min-h-[400px]">
        {COLUMN_ORDER?.map((col) => (
          <KanbanColumn
            key={col}
            id={col}
            label={COLUMN_LABELS[col]}
            tasks={columns[col]}
            canDrag={canDrag}
          />
        ))}
      </div>
    </DndContext>
  );
}
