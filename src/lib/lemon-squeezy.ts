import { prisma } from "./prisma";

const LEMON_SQUEEZY_API_KEY = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API_KEY;
const LEMON_SQUEEZY_STORE_ID = Number(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID);
const PRO_SUBSCRIPTION_VARIANT_ID = Number(process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_VARIANT_ID);
const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

export async function createCheckout(userId: string, email: string) {
  if (!LEMON_SQUEEZY_API_KEY || !LEMON_SQUEEZY_STORE_ID || !PRO_SUBSCRIPTION_VARIANT_ID) {
    throw new Error('Missing LemonSqueezy configuration');
  }

  console.log('Store ID:', LEMON_SQUEEZY_STORE_ID);
  console.log('Variant ID:', PRO_SUBSCRIPTION_VARIANT_ID);

  const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            enabled_variants: [`${PRO_SUBSCRIPTION_VARIANT_ID}`]
          },
          checkout_data: {
            custom: { userId },
            email,
          },
          checkout_options: {
            dark: true,
            media: false,
            embed: false,
          },
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: `${LEMON_SQUEEZY_STORE_ID}`
            }
          },
          variant: {
            data: {
              type: 'variants',
              id: `${PRO_SUBSCRIPTION_VARIANT_ID}`
            }
          }
        }
      },
    }),
  });

  const data = await response.json();
  console.log('LemonSqueezy response:', data); // For debugging

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.detail || 'Failed to create checkout');
  }
  return data.data.attributes.url;
}

export async function createCustomerPortal(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lemonSqueezyCustomerId: true }
  });

  if (!user?.lemonSqueezyCustomerId) {
    throw new Error('No subscription found');
  }

  const response = await fetch(`${LEMON_SQUEEZY_API_URL}/customers/${user.lemonSqueezyCustomerId}/portal`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create customer portal');
  }

  return data.data.attributes.url;
} 