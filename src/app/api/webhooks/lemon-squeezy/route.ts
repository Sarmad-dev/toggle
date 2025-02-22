import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-signature");
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  // Validate inputs
  if (!secret) {
    console.error("Missing webhook secret");
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 500 }
    );
  }

  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(signatureHeader || "", "utf8");

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  // Process validated webhook
  const payload = JSON.parse(rawBody);

  const { data, meta } = payload;

  try {
    switch (meta.event_name) {
      case "subscription_created":
      case "subscription_resumed":
        console.log("👤 Updating user:", meta.custom_data.userId);
        await prisma.user.update({
          where: { id: meta.custom_data.userId },
          data: {
            plan: "PRO",
            lemonSqueezyCustomerId: data.attributes.customer_id.toString(),
            lemonSqueezySubscriptionId: data.id.toString(),
          },
        });

        await prisma.subscription.create({
          data: {
            userId: meta.custom_data.userId,
            plan: "PRO",
            status: "ACTIVE",
            currentPeriodEnd:
              data.attributes.ends_at !== null
                ? new Date(data.attributes.ends_at)
                : undefined,
            lemonSqueezyId: data.id.toString(),
          },
        });
        console.log("✅ User updated successfully");
        break;

      case "subscription_cancelled":
      case "subscription_paused":
      case "subscription_expired":
        console.log("👤 Updating user:", meta.custom_data.userId);
        const user = await prisma.user.findUnique({
          where: { lemonSqueezySubscriptionId: data.id },
        });
        if (!user) {
          console.log("No user found with subscription ID:", data.id);
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: "FREE",
            lemonSqueezySubscriptionId:
              meta.event_name === "subscription_cancelled" ? null : undefined,
          },
        });

        await prisma.subscription.delete({
          where: { userId: meta.custome_data.userId },
        });
        break;
    }

    console.log("Webhook processed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    console.error("Error details:", {
      event: meta.event_name,
      data: JSON.stringify(data, null, 2),
    });
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
