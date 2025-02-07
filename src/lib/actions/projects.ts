"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(data: {
  name: string;
  description?: string;
  color?: string;
  billable: boolean;
  hourlyRate?: number;
  userId: string;
  orgId?: string;
  clientId?: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        billable: data.billable,
        hourlyRate: data.hourlyRate,
        user: {
          connect: { id: data.userId }
        },
      },
    });
    revalidatePath("/dashboard/projects");
    return { success: true, data: project };
  } catch (error) {
    throw new Error(error as string);
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