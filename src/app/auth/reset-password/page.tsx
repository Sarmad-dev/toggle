"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AuthForm } from "@/components/auth/auth-form";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isValidLink, setIsValidLink] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseClient = createClient();

  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      return {
        accessToken: params.get("access_token"),
        refreshToken: params.get("refresh_token"),
      };
    };

    const verifyRecoveryParams = async () => {
      const { accessToken, refreshToken } = parseHashParams();

      if (!accessToken || !refreshToken) {
        toast.error("Invallid or expired reset link");
        router.push("/auth/forgot-password");
        return;
      }

      try {
        // Set the session using the access token and refresh token
        const { error: sessionError } = await supabaseClient.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          toast.error(sessionError.message);
          return;
        }

        setIsValidLink(true);
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Invalid or expired reset link");
        router.push("/auth/forgot-password");
      } finally {
        setLoading(false);
      }
    };

    verifyRecoveryParams();
  }, [router]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");

      if (!token) {
        toast.error("Invalid reset token");
        return;
      }

      // Now update the password
      const { error } = await supabaseClient.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Password updated successfully! Redirecting to login...");
      setTimeout(() => router.push("/auth/sign-in"), 2000);
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Failed to reset password. Please try again.");
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center p-8">Verifying reset link...</div>;
  }

  if (!isValidLink) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Reset Link</h1>
        <p className="text-red-500 mb-4">
          The password reset link is invalid or has expired.
        </p>
        <Link
          href="/auth/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Request new reset link
        </Link>
      </div>
    );
  }

  return (
    <AuthForm
      schema={resetPasswordSchema}
      defaultValues={{ password: "", confirmPassword: "" }}
      onSubmit={onSubmit}
      formFields={[
        {
          name: "password",
          label: "New Password",
          type: "password",
        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
        },
      ]}
      submitButtonText="Reset Password"
      showGoogleSignIn={false}
      showForgotPassword={false}
      type="ForgotPassword"
    />
  );
}
