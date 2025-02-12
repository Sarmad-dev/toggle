"use client";

import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { handleInvitation } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { handleTeamInvitation } from "@/lib/actions/teams";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface NotificationItemProps {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt?: Date;
  read: boolean;
  data: any;
  userId: string;
}

export function NotificationItem({
  id,
  type,
  title,
  message,
  read,
  data,
  userId,
  createdAt
}: NotificationItemProps) {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync } = useMutation({
    mutationKey: ["handle-invitation"],
    mutationFn: async (status: "ACCEPTED" | "DECLINED") => {
      if (type === "PROJECT_INVITATION") {
        await handleInvitation({
          invitationId: data,
          status,
          userId,
        });
      } else if (type === "TEAM_INVITATION") {
        // Handle team invitation
        const response = await handleTeamInvitation(data, status, id)
      }
    },
    onSuccess: (data) => {
      toast.success(`Invitation ${status.toLowerCase()}`)
      queryClient.invalidateQueries({ queryKey: ["notifications"]})
    },
    onError: (error) => {
      toast.error("Something went wrong")
      console.error(error)
    }
  })

  const handleResponse = async (status: "ACCEPTED" | "DECLINED") => {
    await mutateAsync(status)
  };

  return (
    <div className={`p-4 ${read ? "opacity-50" : ""}`}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt!), { addSuffix: true })}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{message}</p>
      {(type === "PROJECT_INVITATION" || type === "TEAM_INVITATION") && !read && (
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