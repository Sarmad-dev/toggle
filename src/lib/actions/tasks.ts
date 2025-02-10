"use server";

import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    // First fetch the task to check permissions
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        user: true,
      },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    // Update the task status
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        project: true,
        user: true,
      },
    });

    // Notify project manager about status change
    await createNotification({
      userId: updatedTask.project.managerId,
      type: "TASK_STATUS_CHANGED",
      title: "Task Status Updated",
      message: `Task "${updatedTask.name}" status changed to ${status}`,
      data: {
        taskId: updatedTask.id,
        projectId: updatedTask.projectId,
        status,
      },
    });

    revalidatePath(`/dashboard/projects/${updatedTask.projectId}`);
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update task status"
    };
  }
}

export async function createTask(data: {
  name: string;
  description?: string;
  projectId: string;
  assignedTo?: string;
  assignToAll?: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}) {
  try {
    // If assignToAll is true, get all project members
    let assignees: string[] = [];
    if (data.assignToAll) {
      const members = await prisma.projectMember.findMany({
        where: { projectId: data.projectId },
        select: { userId: true }
      });
      assignees = members.map(member => member.userId);
    } else if (data.assignedTo) {
      assignees = [data.assignedTo];
    }

    // Create task and assignments
    const task = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignedTo: data.assignedTo
      },
    });

    revalidatePath(`/dashboard/projects/${data.projectId}`);
    return { success: true, data: task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function getProjectTasks(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: tasks };
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
} 