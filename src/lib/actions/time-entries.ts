"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkSubscriptionLimit } from "@/lib/subscription";

export async function createTimeEntry(data: {
  description: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  projectId: string;
  userId: string;
}) {
  const subscriptionCheck = await checkSubscriptionLimit(
    data.userId, 
    'timeEntries',
    data.projectId
  );
  if (!subscriptionCheck.allowed) {
    return { 
      success: false, 
      error: subscriptionCheck.message + ". Please upgrade to Pro for unlimited time entries." 
    };
  }

  try {
    const timeEntry = await prisma.timeEntry.create({
      data: {
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: data.duration,
        project: {
          connect: { id: data.projectId }
        },
        user: {
          connect: { id: data.userId }
        }
      },
      include: {
        project: true,
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, data: timeEntry };
  } catch (error) {
    console.error("Failed to create time entry:", error);
    throw new Error("Failed to create time entry");
  }
}

export async function getTimeEntries(userId: string | undefined) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        OR: [
          { userId: userId }, // User's own time entries
          {
            project: {
              members: {
                some: {
                  userId: userId
                }
              }
            }
          } // Time entries from projects where user is a member
        ]
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        user: {
          select: {
            username: true,
          }
        }
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return { success: true, data: timeEntries };
  } catch (error) {
    console.error("Failed to fetch time entries:", error);
    throw new Error("Failed to fetch time entries");
  }
} 