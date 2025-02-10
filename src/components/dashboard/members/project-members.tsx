"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus2 } from "lucide-react";
import { AddMemberDialog } from "./add-member-dialog";
import { toast } from "sonner";
import { addProjectMember } from "@/lib/actions/projects";
import { useUser } from "@/hooks/use-user";

interface ProjectMembersProps {
  projectId: string;
  managerId: string;
  members: {
    user: {
      id: string;
      username: string;
      image: string | null;
    };
  }[] | undefined;
}

export function ProjectMembers({ projectId, managerId, members = [] }: ProjectMembersProps) {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  
  // Check if current user is manager
  const canManageMembers = user?.id === managerId;

  const handleAddMember = async (userId: string) => {
    if (!canManageMembers) {
      toast.error("You don't have permission to add members");
      return;
    }

    try {
      const result = await addProjectMember({ projectId, userId });
      if (!result.success) {
        throw new Error(result.error);
      }
      toast.success("Invitation sent successfully");
      setOpen(false);
    } catch (error) {
      console.error('Add member error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to send invitation");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Members</h3>
        {canManageMembers && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setOpen(true)}
          >
            <UserPlus2 className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members?.map((member) => (
          <div 
            key={member.user.id}
            className="flex items-center gap-2 p-2 rounded-lg border bg-card"
          >
            <Avatar>
              <AvatarFallback>{member.user.username[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">
              {member.user.username}
            </span>
          </div>
        ))}
      </div>

      <AddMemberDialog
        open={open}
        onOpenChange={setOpen}
        onAddMember={handleAddMember}
        currentMembers={members?.map(m => ({ id: m.user.id })) || []}
      />
    </div>
  );
} 