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
import { CreditCard, Package } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "For individuals and small teams",
    features: ["Up to 3 projects", "Basic time tracking", "Limited reports"],
    price: "$0",
    interval: "month",
  },
  {
    name: "Pro",
    description: "For growing businesses",
    features: [
      "Unlimited projects",
      "Advanced reporting",
      "Team collaboration",
      "Client management",
      "Invoicing",
    ],
    price: "$12",
    interval: "month",
  },
];

export function BillingSettings() {
  const handleUpgrade = () => {
    // TODO: Implement upgrade logic
    toast.success("Redirecting to checkout...");
  };

  const handleManageSubscription = () => {
    // TODO: Implement subscription management
    toast.success("Opening subscription portal...");
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
              >
                {plan.name === "Pro" ? "Upgrade to Pro" : "Current Plan"}
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