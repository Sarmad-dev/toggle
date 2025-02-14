"use client";

import { ProjectList } from "@/components/dashboard/project-list";
import { CreateProject } from "@/components/dashboard/create-project";

export default function ProjectsPage() {
  // const { user } = useUser();
  
  // const { data: projects, isLoading } = useQuery({
  //   queryKey: ["projects"],
  //   queryFn: () => getProjects(user?.id),
  //   enabled: !!user,
  //   initialData: { success: true, data: [] },
  // });

  // if (isLoading) {
  //   return <Spinner />;
  // }

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