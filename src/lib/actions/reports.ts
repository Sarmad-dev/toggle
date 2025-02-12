"use server";

import { prisma } from "@/lib/prisma";

export async function getTimeTrackingStats(userId: string) {
  try {
    const startDate = new Date();
    startDate.setDate(1); // Start of the current month
    const endDate = new Date(); // Current date

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        duration: true,
      },
    });

    const totalDuration = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);

    return {
      success: true,
      data: {
        totalHours: (totalDuration / 3600).toFixed(2), // Convert seconds to hours
      },
    };
  } catch (error) {
    console.error("Error fetching time tracking stats:", error);
    return { success: false, error: "Failed to fetch time tracking stats" };
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

    const totalBillableAmount = billableProjects.reduce((acc, project) => acc + (project.billableAmount || 0), 0);

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
    teamMembers.forEach(member => uniqueMemberIds.add(member.userId));
    projectMembers.forEach(member => uniqueMemberIds.add(member.userId));

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

export async function getRevenueStats(userId: string, startDate: Date, endDate: Date) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        timeEntries: {
          some: {
            userId,
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const totalRevenue = invoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const paidRevenue = invoices
      .filter(invoice => invoice.status === "PAID")
      .reduce((acc, invoice) => acc + invoice.amount, 0);

    return {
      success: true,
      data: {
        totalRevenue,
        paidRevenue,
        outstandingRevenue: totalRevenue - paidRevenue,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch revenue stats" };
  }
}

export async function getFilteredReportData(filter: { type: "projects" | "teams" | "billable"; id?: string }) {
  try {
    if (filter.type === "billable") {
      const billableData = await getBillableAmountReport();
      return billableData;
    } else if (filter.type === "projects" && filter.id) {
      const projectData = await getProjectTimeTracked(filter.id);
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
  const billableProjects = await prisma.project.findMany({
    where: { billable: true },
    select: { name: true, billableAmount: true },
  });

  const labels = billableProjects.map(p => p.name);
  const values = billableProjects.map(p => p.billableAmount || 0);

  return { labels, values };
}

export async function getProjectTimeTracked(projectId: string) {
  const timeEntries = await prisma.timeEntry.findMany({
    where: { projectId },
    select: { duration: true },
  });

  const totalHours = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0) / 3600, 0);

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

  const totalHours = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0) / 3600, 0);

  return { labels: ["Total Hours"], values: [totalHours] };
}

export async function getAllProjects() {
  try {
    const projects = await prisma.project.findMany({
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

export async function getLineChartData(filter: { type: "projects" | "teams" | "billable"; id?: string }) {
  try {
    // Example implementation for line chart data
    const data = await getFilteredReportData(filter);
    return data;
  } catch (error) {
    console.error("Error fetching line chart data:", error);
    throw error;
  }
} 