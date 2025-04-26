import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabaseServer = await createClient();
    const body = (await req.json()) as SignUpFormData;
    const data = signUpSchema.safeParse(body);

    if (data.error) {
      return {
        success: false,
        message: "Validation Error",
      };
    }

    const { email, username, password } = data.data;

    const hashedPassword = await hash(password, 12);

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
      include: {
        accounts: {
          select: {
            type: true,
          },
        },
      },
    });

    if (
      existingUser &&
      existingUser?.accounts.filter((account) => account.type === "credentials").length > 0
    ) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    } else if (
      existingUser &&
      existingUser?.accounts.filter((account) => account.type !== "credentials")
    ) {
      await prisma.user.update({
        where: {
          id: existingUser?.id,
        },
        data: {
          password: hashedPassword,
          username
        },
      });

      await supabaseServer.auth.admin.updateUserById(existingUser.authId,{
        password,
      });

      await prisma.account.create({
        data: {
          userId: existingUser.id,
          type: "credentials",
          provider: "email",
          providerAccountId: existingUser.id,
        },
      });

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`)
    }

    // Create Supabase auth user
    const { data: authData, error: authError } =
      await supabaseServer.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          data: { username },
        },
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

    await prisma.user.create({
      data: {
        email,
        authId: authData.user.id,
        username,
        password: hashedPassword,
        accounts: {
          create: {
            type: "credentials",
            provider: "email",
            providerAccountId: authData.user.id,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Check your email to verify your account",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
