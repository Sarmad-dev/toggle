"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTimeEntry(data: {
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  projectId: string;
  userId: string;
  taskId?: string;
}) {
  try {
    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        projectId: data.projectId,
        userId: data.userId,
        taskId: data.taskId,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, data: timeEntry };
  } catch (error) {
    return { success: false, error: "Failed to create time entry" };
  }
}

export async function getTimeEntries(userId: string) {
  try {
    const entries = await prisma.timeEntry.findMany({
      where: { userId },
      include: {
        project: true,
        task: true,
      },
      orderBy: { startTime: "desc" },
    });
    return { success: true, data: entries };
  } catch (error) {
    return { success: false, error: "Failed to fetch time entries" };
  }
} 