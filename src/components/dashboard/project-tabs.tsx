"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskList } from "@/components/dashboard/task-list";
import { ProjectMembers } from "@/components/dashboard/members/project-members";
import { ProjectChat } from "@/components/dashboard/chat/project-chat";

interface ProjectTabsProps {
  project: {
    id: string;
    managerId: string;
    members: any[];
    _count: {
      tasks: number;
      members: number;
      timeEntries: number;
    };
  };
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  return (
    <Tabs defaultValue="tasks" className="space-y-4">
      <TabsList>
        <TabsTrigger value="tasks">Tasks ({project._count.tasks})</TabsTrigger>
        <TabsTrigger value="members">Members ({project._count.members})</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      
      <TabsContent value="tasks">
        <TaskList projectId={project.id} />
      </TabsContent>
      
      <TabsContent value="members">
        <ProjectMembers 
          projectId={project.id}
          managerId={project.managerId}
          members={project.members}
        />
      </TabsContent>
      
      <TabsContent value="chat">
        <ProjectChat 
          projectId={project.id}
          members={project.members.map(member => ({
            id: member.user.id,
            username: member.user.username,
            image: member.user.image || undefined,
          }))}
        />
      </TabsContent>
    </Tabs>
  );
} 