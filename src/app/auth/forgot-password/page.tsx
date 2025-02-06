"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { toast } from "sonner"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

const defaultValues: ForgotPasswordData = {
  email: "",
}

const formFields = [
  { name: "email" as const, label: "Email", type: "email" },
]

export default function ForgotPasswordPage() {
  const mutation = useMutation<{ success: boolean; message: string }, Error, ForgotPasswordData>({
    mutationFn: async (values: ForgotPasswordData): Promise<{ success: boolean; message: string }> => {
      const response = await fetch("/api/auth/forgot-password", {
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
      toast.error(error.message || "Request failed")
    },
  })

  const onSubmit = async (values: ForgotPasswordData): Promise<void> => {
    await mutation.mutateAsync(values)
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <p className="text-muted-foreground mt-2 w-[350px] text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <AuthForm
        schema={forgotPasswordSchema}
        defaultValues={defaultValues}
        onSubmit={onSubmit}
        formFields={formFields}
        submitButtonText="Send Reset Link"
        showGoogleSignIn={false}
        type="ForgotPassword"
      />
    </>
  )
} 