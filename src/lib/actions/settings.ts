"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(userId: string, data: {
  username?: string;
  name?: string;
  email?: string;
}) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        email: data.email,
      },
    });
    revalidatePath("/dashboard/settings");
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to update profile: ", error)
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateNotificationPreferences(userId: string, data: {
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          notifications: {
            email: data.emailNotifications,
            push: data.pushNotifications,
            weeklyDigest: data.weeklyDigest,
            marketing: data.marketingEmails,
          },
        },
      },
    });
    revalidatePath("/dashboard/settings");
    return { success: true, data: user };
  } catch (error) {
    console.error("Failed to update notification preferences: ", error)
    return { success: false, error: "Failed to update notification preferences" };
  }
}

export async function updateSubscription(userId: string, plan: "FREE" | "BASIC" | "PRO" | "ENTERPRISE") {
  try {
    const subscription = await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      create: {
        userId,
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    revalidatePath("/dashboard/settings");
    return { success: true, data: subscription };
  } catch (error) {
    console.error("Failed to update subscription: ", error)
    return { success: false, error: "Failed to update subscription" };
  }
} 