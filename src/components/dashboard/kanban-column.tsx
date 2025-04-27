"use client";

import React from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { TaskWithTags } from "@/types/global";
import { Card, CardContent } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import TaskDetail from "../TaskDetail";

interface KanbanColumnProps {
  id: string;
  label: string;
  tasks: TaskWithTags[];
  canDrag: (task: TaskWithTags) => boolean;
}

export function KanbanColumn({ id, label, tasks, canDrag }: KanbanColumnProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<TaskWithTags | null>(
    null
  );

  const { setNodeRef, isOver } = useDroppable({ id });

  const handleCardClick = (task: TaskWithTags) => {
    setSelectedTask(task);
    setOpen(true);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        className={`flex-1 min-w-[280px] bg-muted rounded-xl p-3 shadow-sm transition-colors duration-200 ${
          isOver ? "ring-2 ring-primary bg-primary/10" : ""
        }`}
      >
        <div className="font-bold text-lg mb-3 text-center">{label}</div>
        <SortableContext
          items={tasks.map((t, i) => `${id}:${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3 min-h-[60px]">
            {tasks.map((task, idx) => (
              <KanbanTaskCard
                key={task.id}
                id={`${id}:${idx}`}
                task={task}
                canDrag={canDrag(task)}
                onClick={() => handleCardClick(task)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
      <TaskDetail open={open} setOpen={setOpen} selectedTask={selectedTask} />
    </>
  );
}

interface KanbanTaskCardProps {
  id: string;
  task: TaskWithTags;
  canDrag: boolean;
  onClick?: () => void;
}

function KanbanTaskCard({ id, task, canDrag, onClick }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !canDrag });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: canDrag ? "grab" : "not-allowed",
  };
  return (
    <div ref={setNodeRef} style={style} onClick={onClick} className="relative">
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()} // Prevents dialog from opening when dragging
        className="absolute top-2 right-2 cursor-grab p-1 rounded hover:bg-accent"
        title="Drag"
      >
        <GripVertical size={16} />
      </span>
      <Card className="shadow-md border-2 border-transparent hover:border-primary transition-colors duration-200">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="font-semibold text-base">{task.name}</div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Priority: {task.priority}</span>
            <span>
              Due:{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="rounded bg-secondary px-2 py-1 text-xs">
              {task.taskMembers?.[0]?.user?.username || "Unassigned"}
            </span>
            <span className="rounded bg-accent px-2 py-1 text-xs">
              {task.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
