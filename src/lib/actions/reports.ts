"use server";

import { prisma } from "@/lib/prisma";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { createClient } from "../supabase/server";
import { getUser } from "./user";

export async function getTimeTrackingStats(userId: string) {
  try {
    const today = new Date();
    const startDate = startOfMonth(subMonths(today, 11)); // Last 12 months
    const endDate = endOfMonth(today);

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    // Group entries by date and calculate hours
    const entriesByDate = timeEntries.reduce((acc, entry) => {
      const date = format(entry.startTime, "yyyy-MM-dd");
      const hours = Number((entry.duration! / 3600).toFixed(2));

      if (!acc[date]) {
        acc[date] = { date, hours: 0 };
      }
      acc[date].hours += hours;
      return acc;
    }, {} as Record<string, { date: string; hours: number }>);

    // Get active projects count
    const activeProjects = await prisma.project.count({
      where: {
        OR: [
          { managerId: userId, },
          { members: { some: { userId }}}
        ]
      },
    });

    // Get total unique members across all projects
    const projectMembers = await prisma.projectMember.findMany({
      where: {
        project: {
          userId,
        },
      },
      select: {
        userId: true,
      },
    });

    const uniqueMembers = new Set(
      projectMembers.map((member) => member.userId)
    );
    const totalMembers = uniqueMembers.size;

    // Calculate total earnings from billable projects
    const timeEntriesWithBillableAmount = await prisma.timeEntry.findMany({
      where: {
        userId,
        project: {
          billable: true,
        },
      },
      include: {
        project: {
          select: {
            billableAmount: true,
          },
        },
      },
    });

    const totalEarnings = timeEntriesWithBillableAmount.reduce((acc, entry) => {
      const hours = entry.duration! / 3600;
      return acc + hours * (entry.project?.billableAmount || 0);
    }, 0);

    return {
      success: true,
      data: {
        totalHours: Number(
          timeEntries
            .reduce((total, entry) => total + entry.duration! / 3600, 0)
            .toFixed(2)
        ),
        totalEarnings: Number(totalEarnings.toFixed(2)),
        activeProjects,
        totalMembers,
        timeEntries: Object.values(entriesByDate),
      },
    };
  } catch (error) {
    console.error("Error fetching time tracking stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}

export async function getBillableAmount(userId: string) {
  try {
    const billableProjects = await prisma.project.findMany({
      where: {
        managerId: userId,
        billable: true,
      },
      select: {
        billableAmount: true,
      },
    });

    const totalBillableAmount = billableProjects.reduce(
      (acc, project) => acc + (project.billableAmount || 0),
      0
    );

    return {
      success: true,
      data: {
        totalBillableAmount,
      },
    };
  } catch (error) {
    console.error("Error fetching billable amount:", error);
    return { success: false, error: "Failed to fetch billable amount" };
  }
}

export async function getTotalMembers(userId: string) {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        team: {
          managerId: userId,
        },
      },
      select: {
        userId: true,
      },
    });

    const projectMembers = await prisma.projectMember.findMany({
      where: {
        project: {
          managerId: userId,
        },
      },
      select: {
        userId: true,
      },
    });

    const uniqueMemberIds = new Set<string>();
    teamMembers.forEach((member) => uniqueMemberIds.add(member.userId));
    projectMembers.forEach((member) => uniqueMemberIds.add(member.userId));

    return {
      success: true,
      data: {
        totalMembers: uniqueMemberIds.size,
      },
    };
  } catch (error) {
    console.error("Error fetching total members:", error);
    return { success: false, error: "Failed to fetch total members" };
  }
}

export async function getTotalProjectsCurrentMonth(userId: string) {
  try {
    const startDate = new Date();
    startDate.setDate(1); // Start of the current month
    const endDate = new Date(); // Current date

    const totalProjects = await prisma.project.count({
      where: {
        managerId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      success: true,
      data: {
        totalProjectsCurrentMonth: totalProjects,
      },
    };
  } catch (error) {
    console.error("Error fetching total projects:", error);
    return { success: false, error: "Failed to fetch total projects" };
  }
}

export async function getRevenueStats(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        services: true,
      },
    });

    const totalRevenue = invoices.reduce(
      (acc, invoice) =>
        acc +
        invoice.services.reduce(
          (acc, service) => acc + Number(service.total),
          0
        ),
      0
    );

    const paidRevenue = invoices
      .filter((invoice) => invoice.status === "PAID")
      .reduce(
        (acc, invoice) =>
          acc +
          invoice.services.reduce(
            (acc, service) => acc + Number(service.total),
            0
          ),
        0
      );

    return {
      success: true,
      data: {
        totalRevenue,
        paidRevenue,
        outstandingRevenue: totalRevenue - paidRevenue,
      },
    };
  } catch (error) {
    console.error("Failed to fetch revenue stats: ", error);
    return { success: false, error: "Failed to fetch revenue stats" };
  }
}

export async function getFilteredReportData(filter: {
  type: "projects" | "teams" | "billable";
  id?: string;
}) {
  try {
    if (filter.type === "billable") {
      const billableData = await getBillableAmountReport();
      return billableData;
    } else if (filter.id && filter.type === "projects") {
      const projectData = await getProjectTimeTracked(filter.id);
      return projectData;
    } else if (filter.type === "projects") {
      const projectData = await getUserProjectTimeTracked();
      return projectData;
    } else if (filter.type === "teams" && filter.id) {
      const teamData = await getTeamTimeTracked(filter.id);
      return teamData;
    } else {
      throw new Error("Invalid filter");
    }
  } catch (error) {
    console.error("Error in getFilteredReportData:", error);
    throw error;
  }
}

export async function getBillableAmountReport() {
  // Example implementation using Prisma
  const user = await getUser();

  const billableProjects = await prisma.project.findMany({
    where: { billable: true, managerId: user?.id },
    select: { name: true, billableAmount: true },
  });

  const labels = billableProjects.map((p) => p.name);
  const values = billableProjects.map((p) => p.billableAmount || 0);

  return { labels, values };
}

export async function getUserProjectTimeTracked() {
  try {
    const user = await getUser();
    const timeEntries = await prisma.timeEntry.findMany({
      where: { userId: user?.id },
      select: { duration: true },
    });

    const totalHours = timeEntries.reduce(
      (acc, entry) => acc + (entry.duration || 0) / 3600,
      0
    );

    return { labels: ["Total Hours"], values: [totalHours] };
  } catch (error) {
    console.error("Error fetching user project time tracked: ", error);
    return {
      success: false,
      error: "Failed to fetch user project time tracked",
    };
  }
}

export async function getProjectTimeTracked(projectId: string) {
  const timeEntries = await prisma.timeEntry.findMany({
    where: { projectId },
    select: { duration: true },
  });

  const totalHours = timeEntries.reduce(
    (acc, entry) => acc + (entry.duration || 0) / 3600,
    0
  );

  return { labels: ["Total Hours"], values: [totalHours] };
}

export async function getTeamTimeTracked(teamId: string) {
  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      project: {
        teamId,
      },
    },
    select: { duration: true },
  });

  const totalHours = timeEntries.reduce(
    (acc, entry) => acc + (entry.duration || 0) / 3600,
    0
  );

  return { labels: ["Total Hours"], values: [totalHours] };
}

export async function getAllProjects() {
  try {
    const supsabase = await createClient();
    const {
      data: { user: authUser },
    } = await supsabase.auth.getUser();
    if (!authUser) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const projects = await prisma.project.findMany({
      where: { managerId: user.id },
      select: { id: true, name: true },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getAllTeams() {
  try {
    const teams = await prisma.team.findMany({
      select: { id: true, name: true },
    });
    return { success: true, data: teams };
  } catch (error) {
    console.error("Error fetching all teams:", error);
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function getLineChartData(filter: {
  type: "projects" | "teams" | "billable";
  id?: string;
}) {
  try {
    // Example implementation for line chart data
    const data = await getFilteredReportData(filter);
    return data;
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    throw error;
  }
}
