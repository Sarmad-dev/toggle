import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId: params.projectId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: members.map(member => ({
        id: member.user.id,
        username: member.user.username,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
} 