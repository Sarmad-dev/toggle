"use server"

import { prisma } from "@/lib/prisma";
import { createNotification } from "./notifications";

export const handleOrganizationInvitation = async ({
  invitationId,
  status,
  notificationId
}:{
  invitationId: string;
  status: "ACCEPTED" | "DECLINED",
  notificationId: string
}) => {
  try {
    const invitation = await prisma.organizationInvitation.update({
      where: { id: invitationId },
      data: { status },
      include: {
        organization: true,
        user: true,
      },
    });

    if (status === "ACCEPTED") {
      // Create project member record
      await prisma.organizationMembers.create({
        data: {
          organizationId: invitation.organizationId,
          userId: invitation.invitedUserId,
          role: "MEMBER",
        },
      });
      // Notify project owner
      await createNotification({
        userId: invitation.organization.ownerId as string,
        type: "INVITATION_ACCEPTED",
        title: "Invitation Accepted",
        message: `${invitation.user.username} has accepted your invitation to join ${invitation.organization.name}`,
        data: invitation.organizationId
      });
    } else {
      await createNotification({
        userId: invitation.organization.ownerId as string,
        type: "INVITATION_DECLINED",
        title: "Invitation Declined",
        message: `${invitation.user.username} has declined your invitation to join ${invitation.organization.name}`,
        data: invitation.organizationId
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