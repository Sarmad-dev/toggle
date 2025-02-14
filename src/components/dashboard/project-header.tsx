"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import Link from "next/link";
import { ProjectDescription } from "./project-description";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    team: {
      id: string;
      name: string;
    } | null;
    _count: {
      members: number;
    };
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
          <ProjectDescription description={project.description} />
        </div>
        {project.team && (
          <Badge variant="outline" className="text-sm">
            Team: {project.team.name}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/projects/${project.id}/settings`}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
} 