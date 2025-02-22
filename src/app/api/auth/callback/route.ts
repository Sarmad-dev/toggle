import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

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
      const { id, email, user_metadata } = session.user;
      const avatar_url = user_metadata?.avatar_url;
      const full_name = user_metadata?.full_name;

      // Upsert user using Prisma
      await prisma.user.upsert({
        where: { email: email! },
        update: {
          image: avatar_url,
          name: full_name,
          accounts: {
            update: {
              where: {
                provider_providerAccountId: {
                  provider: "google",
                  providerAccountId: id,
                },
              },
              data: {
                type: "oauth",
                provider: "google",
                providerAccountId: id,
              },
            },
          },
        },
        create: {
          email: email!,
          username: email?.split("@")[0] as string,
          name: full_name || email?.split("@")[0],
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
        include: { accounts: true },
      });
    } catch (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(`${origin}/auth/sign-in?error=auth_failed`);
    }
  }

  return NextResponse.redirect(origin);
}
