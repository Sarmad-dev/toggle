import { prisma } from "./prisma";

export const SUBSCRIPTION_LIMITS = {
  FREE: {
    maxProjects: 2,
    maxMembersPerProject: 5,
    maxTimeEntriesPerProject: 5,
  },
  PRO: {
    maxProjects: Infinity,
    maxMembersPerProject: Infinity,
    maxTimeEntriesPerProject: Infinity,
  },
};

export async function checkSubscriptionLimit(userId: string, type: 'projects' | 'members' | 'timeEntries', projectId?: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: true,
    },
  });

  if (!user) throw new Error('User not found');

  const limits = SUBSCRIPTION_LIMITS[user.plan as keyof typeof SUBSCRIPTION_LIMITS];

  switch (type) {
    case 'projects':
      if (user.projects.length >= limits.maxProjects) {
        return {
          allowed: false,
          message: 'You have reached the maximum number of projects for your plan',
        };
      }
      break;

    case 'members':
      if (projectId) {
        const memberCount = await prisma.projectMember.count({
          where: { projectId },
        });
        if (memberCount >= limits.maxMembersPerProject) {
          return {
            allowed: false,
            message: 'You have reached the maximum number of members for this project',
          };
        }
      }
      break;

    case 'timeEntries':
      if (projectId) {
        const timeEntryCount = await prisma.timeEntry.count({
          where: { projectId },
        });
        if (timeEntryCount >= limits.maxTimeEntriesPerProject) {
          return {
            allowed: false,
            message: 'You have reached the maximum number of time entries for this project',
          };
        }
      }
      break;
  }

  return { allowed: true };
} 