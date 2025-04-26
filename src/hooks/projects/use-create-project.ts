"use client";

import { createProject } from "@/lib/actions/projects";
import { createProjectFormSchema } from "@/lib/validations/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { useUser } from "../use-user";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const { mutateAsync, isError, error, isPending, isSuccess } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (values: z.infer<typeof createProjectFormSchema>) =>
      await createProject({
        ...values,
        userId: user?.id as string,
        orgId: user?.organizationOwner?.id as string,
        members: values.members || [],
      }),
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["all-projects"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    mutateAsync,
    isError,
    error,
    isPending,
    isSuccess,
  };
};
