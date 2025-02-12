"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "./notification-item";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "@/lib/actions/notifications";
import { useEffect } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";

export function NotificationDropdown() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(user?.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (socket && user) {
      socket.emit("join-user", user.id);
      
      socket.on("new-notification", () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }

    return () => {
      if (socket) {
        socket.off("new-notification");
      }
    };
  }, [socket, user, queryClient]);

  const unreadCount = notifications?.data?.filter(n => !n.read).length || 0;

  const handleAction = async () => {
    await markAsRead(user?.id);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs flex items-center justify-center text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {notifications?.data?.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          notifications?.data?.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              type={notification.type}
              title={notification.title}
              message={notification.message}
              read={notification.read}
              data={notification.data}
              userId={notification.userId}
              createdAt={notification.createdAt}
            />
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 