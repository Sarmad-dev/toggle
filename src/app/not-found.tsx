"use client"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-4 md:p-6">
      <div className="container max-w-3xl flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="mb-4">
          <Image
            src="/assets/logo.svg"
            alt="Toggle Logo"
            width={200}
            height={50}
            className="dark:invert"
          />
        </Link>

        {/* 404 Illustration */}
        <div className="relative w-full h-64 md:h-80">
          <Image
            src="/assets/404-illustration.svg"
            alt="404 Illustration"
            fill
            className="object-contain dark:invert-[0.85] dark:hue-rotate-180"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Oops! It seems you&apos;ve ventured into uncharted territory. The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-8">
          <Button
            variant="outline"
            className="flex-1 gap-2 text-base"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            className="flex-1 gap-2 text-base bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            asChild
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="text-sm text-muted-foreground pt-8 border-t border-border">
          <p>Need assistance? <Link href="/support" className="text-primary hover:underline">Contact our support team</Link></p>
        </div>
      </div>
    </main>
  );
} 