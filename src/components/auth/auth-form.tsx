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
import { supabase } from "@/lib/supabase/client";
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

  const handleGoogleSignIn = async () => {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });

    console.log("URL from client", data.url);

    if (error) {
      console.error("Google sign-in error:", error);
      // You might want to add toast notification here
      toast.error("Google sign-in error: error.message");
      return;
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formFields.map((field) => (
          <FormField
            key={field.name.toString()}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel className="text-foreground">{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    {...formField}
                    className="h-11 
                          bg-secondary 
                          border-[#E2E8F0] dark:border-[#4A5568]
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
            <p className="text-sm text-primary">
              Already account?{" "}
              <Link href="/auth/sign-in" className="hover:underline">
                Sign In
              </Link>
            </p>
          ) : type === "SignIn" ? (
            <p className="text-sm text-primary">
              No Account?{" "}
              <Link href="/auth/sign-up" className="hover:underline">
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-primary">
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
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-secondary hover:bg-secondary/80 transition-all duration-300 text-black dark:text-white"
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
              "hover:shadow-md dark:hover:shadow-primary/20"
            )}
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        )}
      </form>
    </Form>
  );
}
