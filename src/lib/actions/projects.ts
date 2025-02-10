"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createProjectInvitation } from "./project-invitations";
import { NotificationType } from "@prisma/client";
import { createClient } from "../supabase/server";

export async function createProject(data: {
  name: string;
  description?: string;
  color?: string;
  billable: boolean;
  managerId: string;
  members: string[];
}) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        billable: data.billable,
        managerId: data.managerId,
        userId: data.managerId,
      },
    });

    // Only send invitations if members array is not empty
    if (data.members.length > 0) {
      await Promise.all(
        data.members.map((userId) =>
          createProjectInvitation({
            projectId: project.id,
            userId,
            invitedBy: data.managerId,
          })
        )
      );
    }

    revalidatePath("/dashboard/projects");
    return { success: true, data: project };
  } catch (error) {
    console.error("Project creation error:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function getProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { userId: userId }, // Projects user owns
          {
            members: {
              some: {
                userId: userId
              }
            }
          } // Projects where user is a member
        ]
      },
      include: {
        client: true,
        _count: {
          select: {
            tasks: true,
            timeEntries: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProject(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                image: true
              }
            }
          }
        },
        _count: {
          select: {
            timeEntries: true,
            tasks: true,
            members: true,
          },
        },
      },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    return { success: true, data: project };
  } catch (error) {
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function getProjectMembers(projectId: string) {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return { 
      success: true, 
      data: members.map(m => ({ id: m.userId, username: m.user.username })) 
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch project members" };
  }
}

export async function addProjectMember(data: { projectId: string; userId: string }) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the user from the database
    const invitingUser = await prisma.user.findUnique({
      where: { email: authUser.email }
    });

    if (!invitingUser) {
      return { success: false, error: "User not found" };
    }

    // Get the project to verify it exists and get its name
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      select: { name: true }
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Create the invitation
    const invitation = await prisma.projectInvitation.create({
      data: {
        projectId: data.projectId,
        userId: data.userId,
        invitedById: invitingUser.id,
        status: "PENDING"
      }
    });

    // Create notification for the invited user
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: "PROJECT_INVITATION",
        title: "Project Invitation",
        message: `You have been invited to join project: ${project.name}`,
        data: invitation.id
      }
    });

    revalidatePath(`/dashboard/projects/${data.projectId}`);
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to send project invitation:", error);
    return { success: false, error: "Failed to send invitation" };
  }
}

export async function acceptProjectInvitation(invitationId: string) {
  try {
    const invitation = await prisma.projectInvitation.update({
      where: { id: invitationId },
      data: { status: "ACCEPTED" },
      include: {
        project: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    // Add member to project
    await prisma.projectMember.create({
      data: {
        projectId: invitation.projectId,
        userId: invitation.userId
      }
    });

    // Notify existing members
    await Promise.all(
      invitation.project.members.map(member => 
        prisma.notification.create({
          data: {
            userId: member.user.id,
            type: "PROJECT_MEMBER_ADDED" as NotificationType,
            title: 'Project Member Added',
            message: `A new member has joined the project`,
            data: invitation.projectId
          }
        })
      )
    );

    revalidatePath(`/dashboard/projects/${invitation.projectId}`);
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to accept invitation:", error);
    return { success: false, error: "Failed to accept invitation" };
  }
} 