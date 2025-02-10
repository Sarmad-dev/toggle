"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/use-users";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (userId: string) => Promise<void>;
  currentMembers: { id: string }[];
}

export function AddMemberDialog({ 
  open, 
  onOpenChange, 
  onAddMember,
  currentMembers 
}: AddMemberDialogProps) {
  const { data: usersData, isLoading } = useUsers();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const users = usersData?.data || [];

  const handleSelect = (userId: string) => {
    setSelectedUser(userId === selectedUser ? null : userId);
  };

  const handleInvite = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      await onAddMember(selectedUser);
      setSelectedUser(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Invitation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Project Member</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </div>
              ) : users?.filter(user => 
                !currentMembers.some(member => member.id === user.id)
              ).map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleSelect(user.id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.username}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedUser === user.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <DialogFooter>
          <Button
            onClick={handleInvite}
            disabled={!selectedUser || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Invitation...
              </>
            ) : (
              'Send Invitation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 