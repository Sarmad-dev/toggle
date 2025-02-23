
import { CreateProject } from "@/components/dashboard/create-project";
import { ProjectList } from "@/components/dashboard/project-list";

// export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <CreateProject />
      </div>
      <ProjectList />
    </div>
  );
} 