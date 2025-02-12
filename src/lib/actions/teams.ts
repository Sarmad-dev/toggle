"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createTeam(data: {
  name: string;
  description?: string;
  orgId: string;
  members: { userId: string; role: "OWNER" | "ADMIN" | "MEMBER" }[];
}) {
  try {
    const leaderId = data.members.find((m) => m.role === "OWNER")?.userId;
    if (!leaderId) throw new Error("Team must have an owner");

    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        orgId: data.orgId,
        leaderId,
        managerId: leaderId,
        members: {
          create: data.members,
        },
      },
    });
    revalidatePath("/dashboard/teams");
    return { success: true, data: team };
  } catch (error) {
    return { success: false, error: "Failed to create team" };
  }
}

export async function getManagerTeams(managerId: string) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        managerId,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: true
      },
    });

    return { success: true, data: teams }
  } catch (error) {
    return { success: false, error: "Failed to fetch teams"}
  }
}

export async function getTeams(userId: string) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        projects: true,
      },
    });
    return { success: true, data: teams };
  } catch (error) {
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function createTeamWithInvitations(data: {
  name: string;
  description?: string;
  memberIds: string[];
  projectIds?: string[];
}) {
  try {
    const supabase = await createClient();
    const authResponse = await supabase.auth.getUser();

    if (!authResponse.data?.user?.email) {
      return { success: false, error: "No authenticated user found" };
    }

    const manager = await prisma.user.findUnique({
      where: { email: authResponse.data.user.email },
      select: { id: true, email: true },
    });

    if (!manager) {
      return { success: false, error: "User not found in database" };
    }

    // Create team without members first
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        managerId: manager.id,
      },
    });

    // Add members if any
    if (data.memberIds?.length > 0) {
      // Create invitations
      await Promise.all(
        data.memberIds.map(async (userId) => {
          const invitation = await prisma.teamInvitation.create({
            data: {
              teamId: team.id,
              userId,
              invitedById: manager.id,
            },
          });

          await prisma.notification.create({
            data: {
              userId,
              type: "TEAM_INVITATION",
              title: "Team Invitation",
              message: `You have been invited to join team: ${team.name}`,
              data: invitation.id,
            },
          });
        })
      );
    }

    revalidatePath("/dashboard/teams");
    return { success: true, data: team };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function handleTeamInvitation(
  invitationId: string,
  status: "ACCEPTED" | "DECLINED",
  notificationId?: string
) {
  try {
    // First verify the invitation exists
    const existingInvitation = await prisma.teamInvitation.findUnique({
      where: { id: invitationId },
      include: { team: true },
    });

    if (!existingInvitation) {
      throw new Error("Invitation not found");
    }

    // Update invitation status
    const invitation = await prisma.teamInvitation.update({
      where: { id: invitationId },
      data: { status },
      include: {
        team: true,
      },
    });

    // Add member to team if accepted
    if (status === "ACCEPTED") {
      await prisma.teamMember.create({
        data: {
          teamId: invitation.teamId,
          userId: invitation.userId,
          role: "MEMBER",
        },
      });
    }

    // // Create notification for team manager
    await prisma.notification.create({
      data: {
        userId: invitation.team.managerId!,
        type: "TEAM_MEMBER_ADDED",
        title:
          status === "ACCEPTED" ? "New Team Member" : "Invitation Declined",
        message:
          status === "ACCEPTED"
            ? `A new member has joined the team: ${invitation.team.name}`
            : `A member has declined the invitation to join ${invitation.team.name}`,
        data: invitation.teamId,
      },
    });

    // // Delete the notification if it exists
    console.log("NOTIFICATION ID: ", notificationId);
    if (notificationId) {
      await prisma.notification.delete({
        where: { id: notificationId },
      });
    }

    revalidatePath("/dashboard/teams");
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to handle invitation:", error);
    return { success: false, error: "Failed to handle invitation" };
  }
}
