"use client";

import { createTaskMessage } from "@/lib/actions/tasks";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../use-user";
import { toast } from "sonner";
import queryClient from "@/lib/tanstack/queryClient";
import { useParams } from "next/navigation";

export const useSendTaskMessage = () => {
  const params = useParams();
  const { user } = useUser();
  const { mutateAsync, isPending, error, isError, isSuccess } = useMutation({
    mutationKey: ["send-task-message"],
    mutationFn: (data: { taskId: string; content: string }) =>
      createTaskMessage(data.taskId, data.content, user?.id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", params.projectId as string],
      });
      toast.success("Message sent successfully");
    },
    onError: () => {
      toast.error("Failed to send message");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", params.projectId as string],
      });
    },
  });

  return { mutateAsync, isPending, error, isError, isSuccess };
};
