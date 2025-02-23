import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Password reset instructions sent to your email"
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: "Failed to send reset email" },
      { status: 500 }
    )
  }
} 