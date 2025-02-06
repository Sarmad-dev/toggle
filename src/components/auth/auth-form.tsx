import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Path } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps<T extends z.ZodType> {
  schema: T;
  defaultValues: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  formFields: {
    name: Path<z.infer<T>>;
    label: string;
    type: string;
  }[];
  submitButtonText: string;
  showGoogleSignIn?: boolean;
  showForgotPassword?: boolean;
  type: "SignUp" | "SignIn" | "ForgotPassword";
}

export function AuthForm<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  formFields,
  submitButtonText,
  showGoogleSignIn = true,
  showForgotPassword = false,
  type,
}: AuthFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-[450px] relative z-10 px-4 sm:px-0">
      <div
        className="w-full max-w-[450px] space-y-8 p-8 rounded-xl shadow-lg 
        bg-[#F8F9FB] dark:bg-[#1F2937] 
        border border-[#E5E7EB] dark:border-[#374151]"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {formFields.map((field) => (
              <FormField
                key={field.name.toString()}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      {field.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.type}
                        {...formField}
                        className="h-11 
                          bg-[#EDF2F7] dark:bg-[#2D3748] 
                          border-[#E2E8F0] dark:border-[#4A5568]
                          focus:border-[#8B7355] dark:focus:border-[#8B7355]
                          hover:border-[#8B7355]/50 dark:hover:border-[#8B7355]/50
                          placeholder:text-[#A0AEC0] dark:placeholder:text-[#718096]
                          transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex w-full justify-between">
              {type === "SignUp" ? (
                <p className="text-sm text-[#8B7355]">
                  Already account?{" "}
                  <Link href="/auth/sign-in" className="hover:underline">
                    Sign In
                  </Link>
                </p>
              ) : type === "SignIn" ? (
                <p className="text-sm text-[#8B7355]">
                  No Account?{" "}
                  <Link href="/auth/sign-up" className="hover:underline">
                    Sign Up
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-[#8B7355]">
                  Remember Password?{" "}
                  <Link href="/auth/sign-in" className="hover:underline">
                    Sign In
                  </Link>
                </p>
              )}

              {showForgotPassword && (
                <div className="flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#8B7355] hover:text-[#4A3728] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-[#8B7355] to-[#4A3728] hover:from-[#8B7355]/90 hover:to-[#4A3728]/90 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                submitButtonText
              )}
            </Button>

            {showGoogleSignIn && (
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full h-11 mt-4 flex items-center justify-center gap-2",
                  "transition-all duration-200 hover:scale-[1.02]",
                  "hover:shadow-md dark:hover:shadow-primary/20",
                  "border-[#8B7355]/20 hover:border-[#8B7355]/50"
                )}
                onClick={() => {
                  /* Implement Google sign in */
                }}
              >
                <FcGoogle className="w-5 h-5" />
                Continue with Google
              </Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
