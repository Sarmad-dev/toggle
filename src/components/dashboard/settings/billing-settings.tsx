"use client";

import { Button } from "@/components/ui/button";
import Script from "next/script";
import { format } from "date-fns";
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
import { plans } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addOneMonthClamped, cn } from "@/lib/utils";

export function BillingSettings() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      if (!user?.id || !user?.email) {
        throw new Error("User information is missing");
      }

      const checkoutUrl = await createCheckout(user.id, user.email);
      if (!checkoutUrl) {
        throw new Error("No checkout URL received");
      }

      if (!isScriptLoaded) {
        window.location.href = checkoutUrl;
        return;
      }

      window.LemonSqueezy.Url.Open(checkoutUrl);
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create checkout session"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsLoading(true);
    try {
      const portalUrl = await createCustomerPortal(user?.id as string);
      window.location.href = portalUrl;
    } catch (error) {
      console.error("Failed to open customer portal: ", error);
      toast.error("Failed to open customer portal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success("Subscription cancelled successfully");
      setShowCancelDialog(false);
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel subscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
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
                className={cn(
                  "w-full",
                  plan.name === "Pro" &&
                    user?.plan === "PRO" &&
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                )}
                variant={plan.name === "Pro" ? "default" : "outline"}
                disabled={isLoading}
                onClick={
                  plan.name === "Pro"
                    ? user?.plan === "PRO"
                      ? () => setShowCancelDialog(true)
                      : handleUpgrade
                    : undefined
                }
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : plan.name === "Pro" ? (
                  user?.plan === "PRO" ? (
                    "Cancel Subscription"
                  ) : (
                    "Upgrade to Pro"
                  )
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

      {user?.lemonSqueezySubscriptionId && (
        <div className="mt-6 space-y-4">
          <h4 className="text-lg font-medium">Subscription Details</h4>
          <div className="rounded-lg border p-4 space-y-2">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={cn(
                  "capitalize px-2 py-1 rounded-full text-sm",
                  user.subscription?.cancelAtPeriodEnd
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                )}
              >
                {user.subscription?.cancelAtPeriodEnd ? "Canceling" : "Active"}
              </span>
            </p>
            <p>
              <span className="font-medium">Plan:</span> {user.plan}
            </p>
            <p>
              <span className="font-medium">Started On:</span>{" "}
              {user.subscription?.createdAt &&
                format(new Date(user.subscription.createdAt), "PPP")}
            </p>
            {!user.subscription?.currentPeriodEnd && (
              <p>
                <span className="font-medium">
                  {user.subscription?.cancelAtPeriodEnd
                    ? "Access Until"
                    : "Next Payment"}
                  :
                </span>{" "}
                {user?.subscription?.createdAt && format(
                  addOneMonthClamped(user.subscription.createdAt),
                  "PPP"
                )}
              </p>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your subscription at the end of your current
              billing period. You&apos;ll still have access to Pro features until
              then.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Yes, cancel subscription"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
