import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    try {
      // Exchange code for session
      const {
        data: { session },
        error,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !session?.user) throw error || new Error("No session found");

      // Get user details from OAuth response
      const { id, email, user_metadata, email_confirmed_at } = session.user;
      const avatar_url = user_metadata?.avatar_url;
      const full_name = user_metadata?.full_name as string;

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          accounts: true,
        },
      });

      if (
        existingUser &&
        existingUser.accounts.find((account) => account.type === "oauth")
      ) {
        return NextResponse.redirect(origin);
      } else if (
        existingUser &&
        existingUser.accounts.find((account) => account.type !== "oauth")
      ) {
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            provider: "google",
            providerAccountId: id,
            type: "oauth",
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            expires_at: session.expires_at,
          },
        });

        return NextResponse.redirect(origin);
      }
      // Upsert user using Prisma
      await prisma.user.create({
        data: {
          email: email as string,
          authId: id,
          emailVerified: email_confirmed_at,
          name: full_name,
          username: full_name.replace(" ", "_") + "_" + Math.round(Math.random() * 10000),
          image: avatar_url,
          accounts: {
            create: {
              type: "oauth",
              provider: "google",
              providerAccountId: id,
              access_token: session.access_token,
              refresh_token: session.refresh_token,
              expires_at: session.expires_at,
            },
          },
        },
      });
    } catch (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_failed`);
    }
  }

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/onboarding`);
}
