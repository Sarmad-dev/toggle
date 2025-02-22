"use server";

import { prisma } from "@/lib/prisma";
import { createNotification } from "./notifications";

export async function createProjectInvitation({
  projectId,
  userId,
  invitedBy,
}: {
  projectId: string;
  userId: string;
  invitedBy: string;
}) {
  try {
    const invitation = await prisma.projectInvitation.create({
      data: {
        projectId,
        userId,
        invitedById: invitedBy,
      },
      include: {
        project: true,
        user: true,
      },
    });

    // Create notification for invited user
    await createNotification({
      userId,
      type: "PROJECT_INVITATION",
      title: "Project Invitation",
      message: `You have been invited to join project ${invitation.project.name}`,
      data: invitation.id
    });

    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to create invitation: ", error)
    return { success: false, error: "Failed to create invitation" };
  }
}

export async function handleProjectInvitation({
  invitationId,
  status,
  notificationId,
}: {
  invitationId: string;
  status: "ACCEPTED" | "DECLINED";
  notificationId: string;
}) {
  console.log("INVITATION ID: ", invitationId)
  console.log("STATUS: ", status)
  console.log("NOTIFICATION ID: ", notificationId)

  try {
    const invitation = await prisma.projectInvitation.update({
      where: { id: invitationId },
      data: { status },
      include: {
        project: true,
        user: true,
      },
    });

    if (status === "ACCEPTED") {
      // Create project member record
      await prisma.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: invitation.userId,
          role: "MEMBER",
        },
      });

      // Notify project owner
      await createNotification({
        userId: invitation.project.managerId,
        type: "INVITATION_ACCEPTED",
        title: "Invitation Accepted",
        message: `${invitation.user.username} has accepted your invitation to join ${invitation.project.name}`,
        data: invitation.projectId
      });
    } else {
      await createNotification({
        userId: invitation.project.managerId,
        type: "INVITATION_DECLINED",
        title: "Invitation Declined",
        message: `${invitation.user.username} has declined your invitation to join ${invitation.project.name}`,
        data: invitation.projectId
      })
    }

    // Delete the notification
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true, data: invitation };
  } catch (error) {
    throw error;
  }
} 