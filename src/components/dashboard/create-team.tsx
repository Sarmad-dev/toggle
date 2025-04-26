"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createTeamWithInvitations } from "@/lib/actions/teams";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { useProjects } from "@/hooks/projects/use-projects";
import { useUser } from "@/hooks/use-user";
import CustomInput from "../custom/custom-input";
import CustomTextarea from "../custom/custom-textarea";
import { MultiSelectOption } from "@/types/global";
import { useGetOrganizationMembers } from "@/hooks/organization/use-get-organization-members";

const formSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  description: z.string().optional(),
  memberIds: z.array(z.string()).min(1, "Select at least one member"),
  projectIds: z.array(z.string()).optional(),
});

export function CreateTeam() {
  const [open, setOpen] = useState(false);
  const { members, isLoading: isMembersLoading } = useGetOrganizationMembers();
  const { user } = useUser();
  const { projects, isLoading: isProjectLoading } = useProjects();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      memberIds: [],
      projectIds: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await createTeamWithInvitations({
        ...values,
      });

      if (result.success) {
        toast.success("Team created and inivitation sent to members");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error || "Failed to create team");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <CustomInput placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <CustomTextarea
                      placeholder="Enter team description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Members</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select members"
                      options={
                        members
                          ?.filter((u) => u.user.id !== user?.id)
                          .map((user) => ({
                            value: user.user.id,
                            label: user.user.username,
                            imageUrl: user.user.image,
                            email: user.user.email,
                          })) as MultiSelectOption[]
                      }
                      selected={field.value}
                      onChange={field.onChange}
                      width="w-[475px]"
                      isLoading={isMembersLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Projects (Optional)</FormLabel>
                  <FormControl>
                    <MultiSelect
                      placeholder="Select projects"
                      options={
                        projects?.data
                          ?.filter((project) => project.userId === user?.id)
                          .map((project) => ({
                            value: project.id,
                            label: project.name,
                          })) as MultiSelectOption[]
                      }
                      selected={field.value!}
                      onChange={field.onChange}
                      width="w-[475px]"
                      isLoading={isProjectLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
