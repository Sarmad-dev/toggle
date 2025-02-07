"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeam(data: {
  name: string;
  description?: string;
  orgId: string;
  members: { userId: string; role: "OWNER" | "ADMIN" | "MEMBER" }[];
}) {
  try {
    const team = await prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        orgId: data.orgId,
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