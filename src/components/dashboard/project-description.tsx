"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectDescriptionProps {
  description: string | null;
}

export function ProjectDescription({ description }: ProjectDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="h-auto p-0 hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>Description</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </Button>
      
      <div
        className={cn(
          "text-sm text-muted-foreground overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-40" : "max-h-0"
        )}
      >
        {description}
      </div>
    </div>
  );
} 