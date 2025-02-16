import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const LEMON_SQUEEZY_API_KEY = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export async function POST(req: Request) {
  try {
    const supabaseServer = await createClient();
    const { data: { user: supabaseUser } } = await supabaseServer.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
      select: { id: true, lemonSqueezySubscriptionId: true }
    });

    if (!user?.lemonSqueezySubscriptionId) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 });
    }

    const response = await fetch(
      `${LEMON_SQUEEZY_API_URL}/subscriptions/${user.lemonSqueezySubscriptionId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to cancel subscription" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 