import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';

function verifySignature(payload: string, signature: string) {
  const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_SIGNING_SECRET!);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: Request) {
  const signature = req.headers.get('x-signature');
  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 401 });
  }

  const rawBody = await req.text();
  
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const { event_name, data } = body;

  console.log("Webhook Event:", event_name);
  console.log("Webhook Data:", JSON.stringify(data, null, 2));
  console.log("Custom Data:", data?.attributes?.custom_data);

  try {
    switch (event_name) {
      case 'subscription_created':
      case 'subscription_resumed':
        await prisma.user.update({
          where: { id: data.attributes.custom_data.userId },
          data: {
            plan: 'PRO',
            lemonSqueezyCustomerId: data.attributes.customer_id,
            lemonSqueezySubscriptionId: data.id,
          },
        });
        break;

      case 'subscription_cancelled':
      case 'subscription_paused':
      case 'subscription_expired':
        const user = await prisma.user.findUnique({
          where: { lemonSqueezySubscriptionId: data.id }
        });
        if (!user) {
          console.log("No user found with subscription ID:", data.id);
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'FREE',
            lemonSqueezySubscriptionId: event_name === 'subscription_cancelled' ? null : undefined,
          },
        });
        break;
    }

    console.log("Webhook processed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    console.error('Error details:', {
      event: event_name,
      data: JSON.stringify(data, null, 2),
    });
    return NextResponse.json(
      { success: false, error: "Webhook handler failed" },
      { status: 500 }
    );
  }
} 