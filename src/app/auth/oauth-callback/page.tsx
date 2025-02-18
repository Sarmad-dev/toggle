"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const OAuthCallback = () => {
  const router = useRouter();
  useEffect(() => {
    const handleOAuthCallback = async () => {
      await fetch("/api/auth/callback");
    };
    handleOAuthCallback();

    setTimeout(() => router.push("/dashboard"), 2000);
  }, []);
  
  return (
    <main className="min-h-screen w-full flex flex-col space-y-3 items-center justify-center">
      <p className="text-muted-foreground text-lg">
        Redirecting to dashboard...
      </p>
      <Loader2
        className="animate-spin text-muted-foreground"
        width={40}
        height={40}
      />
    </main>
  );
};

export default OAuthCallback;
