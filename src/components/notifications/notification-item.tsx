"use client";

import { Button } from "@/components/ui/button";
import { handleProjectInvitation } from "@/lib/actions/project-invitations";
import { toast } from "sonner";

interface NotificationItemProps {
  notification: {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  };
  onAction: () => void;
}

export function NotificationItem({ notification, onAction }: NotificationItemProps) {
  const handleInvitation = async (status: "ACCEPTED" | "DECLINED") => {
    try {
      const result = await handleProjectInvitation({
        invitationId: notification.data.invitationId,
        status,
        notificationId: notification.id,
      });

      if (result.success) {
        toast.success(
          status === "ACCEPTED"
            ? "Successfully joined project"
            : "Invitation declined"
        );
        onAction();
      }
    } catch (error) {
      toast.error("Failed to handle invitation");
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium">{notification.title}</div>
      <div className="text-sm text-muted-foreground">{notification.message}</div>
      {notification.type === "PROJECT_INVITATION" && (
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => handleInvitation("ACCEPTED")}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleInvitation("DECLINED")}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
} 