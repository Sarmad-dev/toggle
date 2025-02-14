"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getProject } from "@/lib/actions/projects";
import { Spinner } from "@/components/ui/spinner";
import { ProjectSettingsForm } from "@/components/dashboard/settings/project-settings-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProjectWithDetails } from "@/types/global";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (!project?.data) {
    return <div>Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Project Settings</h1>
      </div>

      <ProjectSettingsForm project={project.data as ProjectWithDetails} />
    </div>
  );
} 