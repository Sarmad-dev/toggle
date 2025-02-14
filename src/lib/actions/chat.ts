"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMessage(data: {
  content: string;
  userId: string;
  projectId: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  replyToId?: string;
}) {
  try {
    const message = await prisma.chatMessage.create({
      data: {
        content: data.content,
        userId: data.userId,
        projectId: data.projectId,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
        replyToId: data.replyToId
      },
      include: {
        user: true,
        replyTo: {
          include: {
            user: true
          }
        }
      }
    });

    revalidatePath(`/dashboard/projects/${data.projectId}`);
    return { success: true, data: message };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function getProjectMessages(projectId: string) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                username: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return { success: true, data: messages };
  } catch (error) {
    console.error("Failed to fetch messages: ", error)
    return { success: false, error: "Failed to fetch messages" };
  }
} 