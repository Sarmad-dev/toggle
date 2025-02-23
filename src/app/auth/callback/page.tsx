'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase as supabaseClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'verified' | 'error'>('verifying')

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Listen for auth state changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
          async (event) => {
            if (event === 'SIGNED_IN') {
              // User has been signed in after email verification
              setVerificationStatus('verified')
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            } else if (event === 'USER_UPDATED') {
              // Email has been verified
              setVerificationStatus('verified')
              setTimeout(() => {
                router.push('/dashboard')
              }, 2000)
            }
          }
        )

        // Cleanup subscription
        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
      }
    }

    handleEmailVerification()
  }, [router, supabaseClient.auth])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {verificationStatus === 'verifying' && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Verifying your email...</p>
        </div>
      )}

      {verificationStatus === 'verified' && (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-8 w-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="text-lg font-medium">Email verified successfully!</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to dashboard...
          </p>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-lg font-medium">Verification failed</p>
          <p className="text-sm text-muted-foreground">
            Please try again or contact support
          </p>
        </div>
      )}
    </div>
  )
}
