"use client";

import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { handleTeamInvitation } from "@/lib/actions/teams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleProjectInvitation } from "@/lib/actions/project-invitations";

interface NotificationItemProps {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt?: Date;
  read: boolean;
  data: string;
  userId: string;
  handleMarkAsRead: () => Promise<void>;
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  read,
  data,
  createdAt,
  handleMarkAsRead,
}: NotificationItemProps) {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending: loading } = useMutation({
    mutationKey: ["handle-invitation"],
    mutationFn: async (status: "ACCEPTED" | "DECLINED") => {
      if (type === "PROJECT_INVITATION") {
        await handleProjectInvitation({
          invitationId: data,
          status,
          notificationId: id as string,
        });
      } else if (type === "TEAM_INVITATION") {
        // Handle team invitation
        await handleTeamInvitation(data, status, id);
      }
    },
    onSuccess: () => {
      toast.success(`Invitation ${status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
  });

  const handleResponse = async (status: "ACCEPTED" | "DECLINED") => {
    await mutateAsync(status);
  };

  return (
    <div className={`p-4 ${read ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex gap-4 items-center">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt!), { addSuffix: true })}
          </span>
          <span
            className="text-xs text-muted-foreground hover:underline cursor-pointer"
            onClick={() => handleMarkAsRead()}
          >
            mark as read
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{message}</p>
      {(type === "PROJECT_INVITATION" || type === "TEAM_INVITATION") &&
        !read && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => handleResponse("ACCEPTED")}
              disabled={loading}
            >
              <Check className="mr-2 h-4 w-4" />
              {loading ? <Loader2 className="animate-spin" /> : "Accept"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => handleResponse("DECLINED")}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
    </div>
  );
}
