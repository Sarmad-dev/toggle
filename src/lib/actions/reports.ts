"use server";

import { prisma } from "@/lib/prisma";

export async function getTimeTrackingStats(userId: string, startDate: Date, endDate: Date) {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: true,
      },
    });

    const totalDuration = timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0);
    const billableDuration = timeEntries
      .filter(entry => entry.billable)
      .reduce((acc, entry) => acc + (entry.duration || 0), 0);

    const projectStats = await prisma.project.findMany({
      where: {
        userId,
        timeEntries: {
          some: {
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      include: {
        timeEntries: {
          where: {
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    return {
      success: true,
      data: {
        totalHours: totalDuration / 3600,
        billableHours: billableDuration / 3600,
        projectStats: projectStats.map(project => ({
          name: project.name,
          hours: project.timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0) / 3600,
        })),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch time tracking stats" };
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