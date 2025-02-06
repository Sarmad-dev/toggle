import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = signUpSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        data: { username },
      }
    });

    if (authError) {
      return NextResponse.json(
        { success: false, message: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, message: "Failed to create user" },
        { status: 400 }
      );
    }

    // Hash password and create user in database
    const hashedPassword = await hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        account: {
          create: {
            type: "credentials",
            provider: "email",
            providerAccountId: authData.user.id,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Check your email to verify your account"
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
