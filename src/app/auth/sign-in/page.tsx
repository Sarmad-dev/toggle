"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const defaultValues: SignInFormData = {
  email: "",
  password: "",
};

const formFields = [
  { name: "email" as const, label: "Email", type: "email" },
  { name: "password" as const, label: "Password", type: "password" },
];

export default function SignInPage() {
  const router = useRouter();

  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    SignInFormData,
    unknown
  >({
    mutationFn: async (
      values: SignInFormData
    ): Promise<{ success: boolean; message: string }> => {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      return data;
    },
    onSuccess: (data) => {
      if (data.success === false) {
        toast.error(data.message);
      } else {
      toast.success(data.message);
      router.push("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign in failed");
    },
  });

  const onSubmit = async (values: SignInFormData): Promise<void> => {
    await mutation.mutateAsync(values);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-center">Sign In</h1>
      <AuthForm
        schema={signInSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        formFields={formFields}
        submitButtonText="Sign In"
        showForgotPassword={true}
        type="SignIn"
      />
    </>
  );
}
