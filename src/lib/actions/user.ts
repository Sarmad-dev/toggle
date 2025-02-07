"use server";

import { prisma } from "../prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};
