"use client";

import { updatedTask } from "@/lib/actions/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "../use-user";
import queryClient from "@/lib/tanstack/queryClient";

export const useUpdateTask = () => {
  const { user } = useUser();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-task"],
    mutationFn: ({
      taskId,
      field,
      value,
      userId,
    }: {
      taskId: string;
      field: string;
      value: string | string[];
      userId: string[];
    }) => updatedTask(taskId, field, value, userId, user?.id as string),
    onSuccess: () => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
