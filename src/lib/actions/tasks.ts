"use server";

import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createTask(data: {
  name: string;
  description?: string;
  projectId: string;
  status: TaskStatus;
  deadline?: Date;
  userId: string;
}) {
  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        priority: "MEDIUM",
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error("Failed to create task");
  }
}

export async function getProjectTasks(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: tasks };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
} 