import { getProject } from "@/lib/actions/projects";
import { ProjectHeader } from "@/components/dashboard/project-header";
import { ProjectTabs } from "@/components/dashboard/project-tabs";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string}>}) {
  const { projectId } = await params
  const { data: project, error } = await getProject(projectId);

  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />

      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Tasks</div>
          <div className="text-2xl font-bold">
            {project?._count?.tasks || 0}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Members
          </div>
          <div className="text-2xl font-bold">
            {project?._count?.members || 0}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Time Entries
          </div>
          <div className="text-2xl font-bold">
            {project?._count?.timeEntries || 0}
          </div>
        </div>
      </div>

      <ProjectTabs project={project} />
    </div>
  );
}
