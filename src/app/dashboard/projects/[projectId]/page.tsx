import { getProject } from "@/lib/actions/projects";
import { ProjectHeader } from "@/components/dashboard/project-header";
import { ProjectTabs } from "@/components/dashboard/project-tabs";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params: { projectId },
}: {
  params: { projectId: string };
}) {
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

      {/* Add more project details sections here */}

      {/* <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          {project?.managerId === user?.id && (
            <CreateTask
              projectId={projectId}
              managerId={project?.managerId as string}
            />
          )}
        </div>
        <TaskList projectId={projectId} />
      </div>

      <ProjectMembers
        projectId={projectId}
        managerId={project?.managerId as string}
        members={project?.members}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Project Chat</h2>
        <ProjectChat
          projectId={projectId}
          members={
            project?.members?.map((member) => ({
              id: member.user.id,
              username: member.user.username,
              image: member.user.image || undefined,
            })) || []
          }
        />
      </div> */}
    </div>
  );
}
