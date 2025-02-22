"use client"
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import { Timer } from "./timer";
import { DashboardNav } from "./nav";

const LeftSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <aside
      className={cn(
        "h-screen",
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
  );
};

export default LeftSidebar;
