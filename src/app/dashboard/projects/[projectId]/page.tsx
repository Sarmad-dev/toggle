import { getProject } from "@/lib/actions/projects";
import { notFound } from "next/navigation";
import { CreateTask } from "@/components/dashboard/create-task";
import { TaskList } from "@/components/dashboard/task-list";
import { ProjectChat } from "@/components/dashboard/chat/project-chat";
import { ProjectMembers } from "@/components/dashboard/members/project-members";
import { useUser } from "@/hooks/use-user";
import { getUser } from "@/lib/actions/user";

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const result = await getProject(params.projectId);
  const user = await getUser()

  if (!result.success) {
    return notFound();
  }

  const project = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{project?.name}</h2>
        <div className="flex items-center gap-4">
          {/* Add project actions here */}
        </div>
      </div>

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

      {/* Add more project details sections here */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          {project?.managerId === user?.id && (
            <CreateTask
              projectId={params.projectId}
              managerId={project?.managerId as string}
            />
          )}
        </div>
        <TaskList projectId={params.projectId} />
      </div>

      <ProjectMembers
        projectId={params.projectId}
        managerId={project?.managerId as string}
        members={project?.members}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Project Chat</h2>
        <ProjectChat
          projectId={params.projectId}
          members={
            project?.members?.map((member) => ({
              id: member.user.id,
              username: member.user.username,
              image: member.user.image || undefined,
            })) || []
          }
        />
      </div>
    </div>
  );
}
