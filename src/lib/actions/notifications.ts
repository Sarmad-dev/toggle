"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NotificationType } from "@prisma/client";
import { RealtimeManager } from "@/lib/realtime";

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: string;
}) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type: data.type,
        title: data.message,
        message: data.message,
        userId: data.userId,
        data: data.data,
      },
    });

    // Send realtime notification
    await RealtimeManager.sendNotification(data.userId, notification);

    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
    throw error;
  }
}

export async function handleInvitation(data: {
  invitationId: string;
  status: "ACCEPTED" | "DECLINED";
  userId: string;
}) {
  try {
    const invitation = await prisma.projectInvitation.update({
      where: { id: data.invitationId },
      data: { status: data.status },
      include: { project: true },
    });

    if (data.status === "ACCEPTED") {
      await prisma.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: data.userId,
          role: "MEMBER",
        },
      });
    }

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Failed to handle invitation:", error);
    throw new Error("Failed to handle invitation");
  }
}

export async function getNotifications(userId: string | undefined) {
  if (!userId) return { success: true, data: [] };
  
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return { success: true, data: notifications };
  } catch (error) {
    console.error("Failed to fetch notifications: ", error)
    throw new Error("Failed to fetch notifications");
  }
}

export async function markAsRead(userId: string | undefined) {
  if (!userId) return;
  
  try {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read: ", error)
    return { success: false, error: "Failed to mark notifications as read" };
  }
} 