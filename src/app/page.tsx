import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, Users2, Calendar, BarChart2, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SiteHeader } from "@/components/landing/site-header";
import { features, testimonials } from "@/lib/constants";
import { PreviewCarousel } from "@/components/landing/preview-carousel";

export default async function Home() {
  const supabaseServer = await createClient();
  const { data: { session } } = await supabaseServer.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader isLoggedIn={!!session} />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
          <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-primary dark:to-indigo-600" />
        </div>
        <div className="container px-4 mx-auto relative">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
              Track Time, Boost Productivity
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fade-up animation-delay-100">
              The all-in-one solution for time tracking, project management, and team collaboration.
              Streamline your workflow and enhance team productivity.
            </p>
            <div className="flex gap-4 animate-fade-up animation-delay-200">
              <Link href={session ? "/dashboard" : "/login"}>
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-16 animate-fade-up animation-delay-300">
            <PreviewCarousel />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Your Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={cn(
                  "p-6 rounded-lg border bg-card hover:shadow-lg transition-all",
                  "animate-fade-up",
                  `animation-delay-${(index + 1) * 100}`
                )}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary/5">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Loved by Teams Worldwide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.author}
                className={cn(
                  "p-6 rounded-lg bg-card border hover:shadow-lg transition-all",
                  "animate-fade-up",
                  `animation-delay-${(index + 1) * 100}`
                )}
              >
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-700">
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        </div>
        <div className="relative container text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-up">
            Ready to Transform Your Team's Productivity?
          </h2>
          <p className="text-xl mb-8 animate-fade-up animation-delay-100 text-white/80">
            Join thousands of teams already using our platform to achieve more.
          </p>
          <Link href={session ? "/dashboard" : "/login"}>
            <Button
              size="lg"
              variant="outline"
              className="animate-fade-up animation-delay-200 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 text-white"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
