"use client"
import dynamic from 'next/dynamic'
import { CreateProject } from "@/components/dashboard/create-project";
 
const ProjectListDynamic = dynamic(
  () => import('@/components/dashboard/project-list').then(mod => mod.ProjectList),
  { ssr: false }
)

export default function ProjectsPage() {

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <CreateProject />
      </div>
      <ProjectListDynamic />
    </div>
  );
} 