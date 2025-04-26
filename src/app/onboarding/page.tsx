"use client"
import OnboardingForm from "@/components/onboarding/onboarding-form";
import { OnboardingIllustration } from "@/components/onboarding/onboarding-illustration";
import { useUser } from "@/hooks/use-user";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect } from "react";

const Onboarding = () => {
  const { user, isLoading } = useUser()
  // Check if user was created more than 20 minutes ago
  useEffect(() => {
    const TWENTY_MINUTES = 20 * 60 * 1000;
    if (!isLoading && user?.createdAt && 
        (Date.now() - new Date(user.createdAt).getTime()) > TWENTY_MINUTES) {
      notFound();
    }

    if (user?.organizationOwner?.id) {
      notFound()
    }
  }, [user, isLoading]);

  // Show nothing while checking user status
  if (isLoading || !user) return null;

  return (
    <main className="w-full h-screen flex">
      <aside className="flex-1 flex items-center justify-center">
        <div className="w-[450px] flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Image 
                src="/assets/logo.svg" 
                alt="Toggle" 
                width={180} 
                height={45}
                className="dark:invert"
              />
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Onboarding
              </span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Create your organization
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Set up your workspace and start collaborating with your team
              </p>
            </div>
          </div>
          <OnboardingForm formType="EXTEND" />
        </div>
      </aside>
      <aside className="flex-1 flex flex-col space-y-4 items-center justify-center">
        <OnboardingIllustration />
      </aside>
    </main>
  );
};

export default Onboarding;
