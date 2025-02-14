"use server";

import { prisma } from "../prisma";
import { createClient } from "../supabase/server";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany();

    return users;
  } catch (error) {
    console.error("Failed to fetch users: ", error)
    throw new Error("Failed to fetch users");
  }
};

export const getUser = async () => {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    const user = await prisma.user.findUnique({
      where: {
        email: authUser?.email
      }, 
      select: {
        id: true,
        email: true
      }
    })

    return user

  } catch (error) {
    console.error("Failed to fetch user: ", error)
    if (error instanceof Error) throw new Error(error.message)
  }
}
