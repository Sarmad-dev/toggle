import React from "react";
import { TaskDetailDialog } from "./dashboard/task-detail-dialog";
import { addMembersToTask } from "@/lib/actions/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useParams } from "next/navigation";
import { useProjectMembers } from "@/hooks/projects/use-project-members";
import { TaskWithTags } from "@/types/global";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedTask: TaskWithTags | null;
}

const TaskDetail = ({ open, setOpen, selectedTask }: Props) => {
  const params = useParams();
  const projectId = params.projectId;

  const { user } = useUser();

  const { projectMembers } = useProjectMembers(projectId as string);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-task-members"],
    mutationFn: ({ taskId, userId }: { taskId: string; userId: string[] }) =>
      addMembersToTask({ taskId, userId }),
    onSuccess: () => {
      toast.success("Task assigned");
    },
    onError: (error) => {
      toast.error("Something went wrong " + error.message);
    },
  });

  const onAddMembers = async (taskId: string, userId: string[]) => {
    await mutateAsync({ taskId, userId });
  };

  return (
    <TaskDetailDialog
      open={open}
      onOpenChange={setOpen}
      task={selectedTask}
      isManager={
        projectMembers?.data?.some((m) => m.role === "MANAGER") ||
        projectMembers?.data?.some((m) => m.role === "LEADER") ||
        projectMembers?.data?.some((m) => m.project.user?.id === user?.id) ||
        false
      }
      currentMembers={selectedTask?.taskMembers.map((m) => m.user) || []}
      allUsers={projectMembers?.data?.map((m) => m.user) || []}
      activities={
        selectedTask?.taskActivity?.map((act) => ({
          id: act.id,
          content: act.content,
          createdAt: act.createdAt,
          user: act.user,
        })) || []
      }
      chat={selectedTask?.TaskMessages || []}
      onAddMember={(taskId, userId) => onAddMembers(taskId, userId)}
      isPending={isPending}
    />
  );
};

export default TaskDetail;
