import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabaseServer = await createClient();
     const {
      data: { user: supabaseUser },
      error,
    } = await supabaseServer.auth.getUser();

    if (error || !supabaseUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: supabaseUser.email },
      select: {
        id: true,
        email: true,
        username: true,
        orgId: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 