"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { MenuIcon, XIcon } from "lucide-react";
import { DashboardNav } from "@/components/dashboard/nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { Timer } from "@/components/dashboard/timer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "transform transition-transform duration-200 ease-in-out",
          "bg-background border-r",
          !sidebarOpen && "-translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <img src="/assets/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="font-semibold">TimeTrack</span>
          </div>
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

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>

          <div className="flex items-center space-x-4">
            <UserNav />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="container mx-auto py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}