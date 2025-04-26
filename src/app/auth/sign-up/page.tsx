"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const defaultValues: SignUpFormData = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

const formFields = [
  { name: "email" as const, label: "Email", type: "email" },
  { name: "username" as const, label: "Username", type: "text" },
  { name: "password" as const, label: "Password", type: "password" },
  {
    name: "confirmPassword" as const,
    label: "Confirm Password",
    type: "password",
  },
];

export default function SignUpPage() {
  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    SignUpFormData,
    unknown
  >({
    mutationFn: async (
      values: SignUpFormData
    ): Promise<{ success: boolean; message: string }> => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };
      if (!response.ok) {
        toast.error(data.message || "Something went wrong");
      }
      return data;
    },
    onSuccess: (data) => {
      if (data.success) toast.success(data.message);
      else toast.error(data.message);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign up failed");
    },
  });

  const onSubmit = async (values: SignUpFormData): Promise<void> => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="max-sm:w-screen px-4">
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to continue</CardDescription>
        </CardHeader>
        <CardContent className="sm:w-[450px] w-full">
          <AuthForm
            schema={signUpSchema}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            formFields={formFields}
            submitButtonText="Sign Up"
            type="SignUp"
          />
        </CardContent>
      </Card>
    </div>
  );
}
