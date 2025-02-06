'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { AuthForm } from '@/components/auth/auth-form';
import { supabaseClient } from '@/lib/supabase/client';
import { resetPasswordSchema } from '@/lib/validations/auth';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isValidAccess, setIsValidAccess] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabaseClient.auth.getSession();

      if (error || !session) {
        toast.error('Invalid or expired reset link');
        router.push('/auth/sign-in');
        return;
      }

      setIsValidAccess(true);
    };

    checkSession();
  }, [router]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      await supabaseClient.auth.signOut();
      
      toast.success('Password updated successfully');
      router.push('/auth/sign-in');
    } catch (error) {
      console.error('Reset error:', error);
      throw new Error('Failed to reset password');
    }
  };

  if (!isValidAccess) {
    return null;
  }

  return (
    <AuthForm
      schema={resetPasswordSchema}
      defaultValues={{
        password: '',
        confirmPassword: '',
      }}
      onSubmit={onSubmit}
      formFields={[
        {
          name: 'password',
          label: 'New Password',
          type: 'password',
        },
        {
          name: 'confirmPassword',
          label: 'Confirm Password',
          type: 'password',
        },
      ]}
      submitButtonText="Reset Password"
      showGoogleSignIn={false}
      showForgotPassword={false}
      type="ForgotPassword"
    />
  );
} 