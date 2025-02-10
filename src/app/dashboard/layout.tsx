"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MenuIcon, XIcon } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { Timer } from "@/components/dashboard/timer";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(
      "relative min-h-screen overflow-hidden",
      theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"
    )}>
      <Header />
      <div className="flex overflow-hidden pt-14">
        {/* Sidebar - Made sticky */}
        <aside
          className={cn(
            "sticky left-0 h-[calc(100vh-3.5rem)]",
            "w-64 flex-shrink-0",
            "transform transition-transform duration-200 ease-in-out",
            "bg-background border-r z-50",
            !sidebarOpen && "-translate-x-full",
            "lg:relative lg:translate-x-0"
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <Timer />
            <DashboardNav />
          </div>
        </aside>

        {/* Main content - Scrollable */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}