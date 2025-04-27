"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import { checkSubscriptionLimit } from "../subscription";
import { getUser } from "./user";
import { ProjectTask, TaskWithProject } from "@/types/global";

export async function updateTaskStatus(
  taskId: string,
  status: "DRAFT" | "TODO" | "IN_PROGRESS" | "COMPLETED"
) {
  try {
    // First fetch the task to check permissions
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        assignedTo: true,
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
        assignedTo: true,
      },
    });

    // Notify project manager about status change
    await createNotification({
      userId: updatedTask.project.userId as string,
      type: "TASK_STATUS_CHANGED",
      title: "Task Status Updated",
      message: `Task "${updatedTask.name}" status changed to ${status}`,
      data: updatedTask.id,
    });

    revalidatePath(`/dashboard/projects/${updatedTask.projectId}`);
    return { success: true, data: updatedTask };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update task status",
    };
  }
}

export async function createTask(data: {
  name: string;
  description?: string;
  projectId: string;
  assignedTo?: string[];
  assignToAll?: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}) {
  try {
    const user = await getUser();
    const subscriptionCheck = await checkSubscriptionLimit(
      user?.id as string,
      "tasks",
      data.projectId
    );
    if (!subscriptionCheck.allowed) {
      return {
        success: false,
        error:
          subscriptionCheck.message +
          ". Please upgrade to Pro to create more projects.",
      };
    }
    // If assignToAll is true, get all project members
    // @typescript-eslint/no-unused-vars

    // TODO: update the assignee to be an array of users in the project schema
    let assignees: string[] = [];
    if (data.assignToAll) {
      const members = await prisma.projectMember.findMany({
        where: { projectId: data.projectId },
        select: { userId: true },
      });
      assignees = members.map((member) => member.userId);
    } else if (data.assignedTo) {
      //  @typescript-eslint/no-unused-vars
      assignees = data.assignedTo;
    }

    // Create task and assignments
    const task = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        assignedTo: {
          connect: assignees.map((userId) => ({ id: userId })),
        },
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
        TaskMembers: {
          include: {
            user: true,
          },
        },
        assignedTo: true,
        tags: true,
        TaskActivity: {
          include: {
            user: true,
          },
        },
        TaskMessages: {
          include: {
            user: true,
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

export const createMultipleTasks = async (
  tasks: ProjectTask[],
  projectId: string
) => {
  try {
    if (tasks && tasks.length > 0) {
      tasks.map(async (task) => {
        await prisma.task.create({
          data: {
            name: task.name,
            description: task.description,
            projectId: projectId,
            priority: task.priority,
            tags: {
              create: task.tags,
            },
          },
        });
      });
      revalidatePath(`/dashboard/projects/${projectId}`);
      return { success: true };
    }
    return { success: false, error: "No tasks to create" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create tasks:", error.message);
      return { success: false, error: error.message };
    }
  }
};

export const addMembersToTask = async ({
  taskId,
  userId,
}: {
  taskId: string;
  userId: string[];
}) => {
  try {
    const members = await prisma.taskMembers.createMany({
      data: userId.map((id) => ({
        taskId,
        userId: id,
      })),
    });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            user: true,
          },
        },
      },
    });

    await prisma.notification.createMany({
      data: userId.map((id) => ({
        userId: id,
        type: "TASK_MEMBER_ADDED",
        title: "Task Member Added",
        message: `You have been added to task ${task?.name} in ${task?.project?.name} by ${task?.project?.user?.name}`,
        data: taskId,
      })),
    });

    return { success: true, data: members };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to add members to task:", error.message);
      return { success: false, error: error.message };
    }
  }
};

export const updatedTask = async (
  taskId: string,
  field: string,
  value: string | string[],
  userId: string[],
  managerId: string
) => {
  try {
    let task: TaskWithProject | null = null;
    if (value instanceof Array) {
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
        },
        include: {
          tags: true,
        },
      });

      const tagsToRemoved = task?.tags.filter(
        (tag) => !value.includes(tag.name)
      );

      if (tagsToRemoved) {
        await Promise.all(
          tagsToRemoved.map(async (tag) => {
            await prisma.tag.update({
              where: { id: tag.id },
              data: {
                tasks: {
                  disconnect: { id: taskId },
                },
              },
            });
          })
        );
      }

      value.map(async (t) => {
        const existingTag = await prisma.tag.findFirst({
          where: { name: t },
          include: {
            tasks: {
              include: {
                tags: true,
              },
            },
          },
        });

        if (existingTag?.tasks.some((task) => task.id === taskId)) {
          return null;
        }

        if (existingTag) {
          await prisma.tag.update({
            where: { id: existingTag.id },
            data: {
              tasks: {
                connect: { id: taskId },
              },
            },
          });
          return;
        }

        await prisma.tag.create({
          data: {
            name: t,
            tasks: {
              connect: { id: taskId },
            },
          },
        });
      });

      await prisma.taskActivity.create({
        data: {
          taskId,
          content: `Tags ${value
            .map((t) => `"${t}"`)
            .join(", ")} added to task`,
          userId: managerId,
        },
      });
    } else {
      task = await prisma.task.update({
        where: { id: taskId },
        data: {
          [field]: value,
        },
        include: {
          project: {
            include: {
              user: true,
            },
          },
        },
      });

      await prisma.taskActivity.create({
        data: {
          taskId,
          content: `${field} updated, check task`,
          userId: managerId,
        },
      });
    }

    await prisma.notification.createMany({
      data: userId.map((id) => ({
        userId: id,
        type: "TASK_MEMBER_ADDED",
        title: "Task Updated",
        message: `Task ${task?.name} updated by ${task?.project?.user?.name}`,
        data: taskId,
      })),
    });

    if (task !== null) {
      return { success: true, data: task };
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to add members to task:", error.message);
      return { success: false, error: error.message };
    }
  }
};

export const createTaskMessage = async (
  taskId: string,
  content: string,
  userId: string
) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    const message = await prisma.chatMessage.create({
      data: {
        content,
        taskId,
        userId,
      },
    });

    if (!message) {
      return {
        success: false,
        error: "Message not sent, something went wrong",
      };
    }

    return { success: true, data: message };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create task message:", error.message);
      return { success: false, error: error.message };
    }
  }
};
