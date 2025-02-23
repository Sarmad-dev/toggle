"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = React.HTMLAttributes<HTMLDivElement>

const Spinner: React.FC<SpinnerProps> = ({ className, ...props }) => (
  <div className={cn("flex min-h-screen items-center justify-center", className)} {...props}>
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

Spinner.displayName = "Spinner";

export { Spinner }; 