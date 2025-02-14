import { LemonSqueezyCheckout } from '../../../../types/global';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from 'crypto';
import { headers } from "next/headers";

function verifySignature(payload: LemonSqueezyCheckout, signature: string) {
  const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_SIGNING_SECRET!);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: Request) {
  const headersList = headers();
  const signature = (await headersList).get('x-signature');

  console.log('🪝 WEBHOOK REQUEST RECEIVED 🪝');
  console.log('📍 URL:', req.url);
  console.log('📝 Method:', req.method);
  console.log('📋 Headers:', JSON.stringify(Object.fromEntries((await headersList).entries()), null, 2));

  if (!signature) {
    console.log('❌ ERROR: Missing signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 401 });
  }

  const body = await req.json() as LemonSqueezyCheckout;
  console.log('📦 Webhook Body:', JSON.stringify(body, null, 2));
  
  if (!verifySignature(body, signature)) {
    console.log('❌ ERROR: Invalid signature');
    console.log('🔐 Expected:', crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_SIGNING_SECRET!).update(JSON.stringify(body)).digest('hex'));
    console.log('🔑 Received:', signature);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const { event_name, data, meta } = body;

  console.log("📢 Event:", event_name);
  console.log("📄 Data:", JSON.stringify(data, null, 2));
  console.log("🔍 Meta:", JSON.stringify(meta, null, 2));

  try {
    switch (event_name) {
      case 'subscription_created':
      case 'subscription_resumed':
      case 'subscription_updated':
        console.log('👤 Updating user:', meta.custom_data.userId);
        await prisma.user.update({
          where: { id: meta.custom_data.userId },
          data: {
            plan: 'PRO',
            lemonSqueezyCustomerId: data.attributes.customer_id,
            lemonSqueezySubscriptionId: data.id,
          },
        });
        console.log('✅ User updated successfully');
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