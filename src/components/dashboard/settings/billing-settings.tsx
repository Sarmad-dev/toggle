"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { CreditCard, Package, Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { createCheckout, createCustomerPortal } from "@/lib/lemon-squeezy";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    description: "For individuals and small teams",
    features: [
      "Up to 2 projects",
      "5 members per project",
      "5 time entries per project",
      "Basic reporting"
    ],
    price: "$0",
    interval: "month",
  },
  {
    name: "Pro",
    description: "For growing businesses",
    features: [
      "Unlimited projects",
      "Unlimited members per project",
      "Unlimited time entries",
      "Advanced analytics & reporting",
      "Client management",
      "Custom invoicing",
      "Priority support"
    ],
    price: "$15",
    interval: "month",
  },
];

export function BillingSettings() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      if (!user?.id || !user?.email) {
        throw new Error('User information is missing');
      }

      const checkoutUrl = await createCheckout(user.id, user.email);
      if (!checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create checkout session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await createCustomerPortal(user.id);
      window.location.href = portalUrl;
    } catch (error) {
      toast.error("Failed to open customer portal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing and Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">
                {plan.price}
                <span className="text-sm font-normal">/{plan.interval}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={plan.name === "Pro" ? handleUpgrade : undefined}
                variant={plan.name === "Pro" ? "default" : "outline"}
                disabled={isLoading || (plan.name === "Pro" && user?.plan === "PRO")}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : plan.name === "Pro" ? (
                  user?.plan === "PRO" ? "Current Plan" : "Upgrade to Pro"
                ) : (
                  "Free Plan"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          onClick={handleManageSubscription}
          className="flex items-center"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Billing
        </Button>
      </div>
    </div>
  );
} 