"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ProjectTask } from "@/types/global";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { createMultipleTasks } from "@/lib/actions/tasks";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  tasks: ProjectTask[];
  projectId: string;
};

const CreateTaksDialog = ({ open, setOpen, tasks, projectId }: Props) => {
  const [selectedTasks, setSelectedTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setLoading(true);
      await createMultipleTasks(selectedTasks, projectId as string);
      toast.success("Task created successfully");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hidden"
          onClick={() => setOpen(true)}>
          Create Tasks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Taks</DialogTitle>
          <DialogDescription>
            Select from the pre generated AI tasks for your project
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="px-2 py-3 border-primary border-spacing-1.5 rounded-md bg-secondary flex items-center gap-3">
                <Checkbox
                  checked={selectedTasks.includes(task)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? setSelectedTasks((prev) => [...prev, task])
                      : setSelectedTasks((prev) =>
                          prev?.filter((value) => value !== task)
                        );
                  }}
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-normal text-primary">
                        {task.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {task.description}
                      </span>
                    </div>
                    <Badge
                      variant={
                        task.priority === "HIGH"
                          ? "destructive"
                          : task.priority === "MEDIUM"
                          ? "warning"
                          : "green"
                      }
                      className="text-xs font-normal">
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag.name}
                        className={`text-xs font-normal text-white bg-${tag.color}-500`}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4 flex justify-between items-center">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Create Tasks"}
            </Button>
          </DialogFooter>
        </form>
        <div></div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaksDialog;
