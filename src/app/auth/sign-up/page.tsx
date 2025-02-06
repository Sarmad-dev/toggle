"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth"
import { AuthError } from "@supabase/supabase-js"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

const defaultValues: SignUpFormData = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
}

const formFields = [
  { name: "email" as const, label: "Email", type: "email" },
  { name: "username" as const, label: "Username", type: "text" },
  { name: "password" as const, label: "Password", type: "password" },
  { name: "confirmPassword" as const, label: "Confirm Password", type: "password" },
]

export default function SignUpPage() {
  const mutation = useMutation<
    { success: boolean; message: string },
    Error,
    SignUpFormData,
    unknown
  >({
    mutationFn: async (values: SignUpFormData): Promise<{ success: boolean; message: string }> => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = (await response.json()) as { success: boolean; message: string }
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }
      return data
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Sign up failed")
    },
  })

  const onSubmit = async (values: SignUpFormData): Promise<void> => {
    await mutation.mutateAsync(values)
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-2 text-center">Sign Up</h1>
      <AuthForm
        schema={signUpSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        formFields={formFields}
        submitButtonText="Sign Up"
        type="SignUp"
      />
    </>
  )
} 