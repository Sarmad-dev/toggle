"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createProjectInvitation } from "./project-invitations";

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
      where: { userId },
      include: {
        client: true,
        tasks: true,
        timeEntries: true,
      },
    });
    return { success: true, data: projects };
  } catch (error) {
    return { success: false, error: "Failed to fetch projects" };
  }
} 