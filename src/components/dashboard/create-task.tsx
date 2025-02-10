"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createTask } from "@/lib/actions/tasks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { Plus, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  assignToAll: z.boolean().default(false),
});

interface CreateTaskProps {
  projectId: string;
  managerId: string;
}

export function CreateTask({ projectId, managerId }: CreateTaskProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Array<{ id: string; username: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();

  // Check if current user is manager
  const canCreateTasks = user?.id === managerId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      assignedTo: undefined,
      priority: "MEDIUM",
      assignToAll: false,
    },
  });

  // Fetch project members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/members`);
        const data = await response.json();
        if (data.success) {
          setMembers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    if (open) {
      fetchMembers();
    }
  }, [projectId, open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const result = await createTask({
        ...values,
        projectId,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Task created successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error)
      toast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (!canCreateTasks) {
      toast.error("You don't have permission to create tasks");
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick} disabled={!canCreateTasks}>
        <Plus className="h-4 w-4 mr-2" />
        Create Task
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title" {...field} />
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
                      <Input placeholder="Task description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignToAll"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Assign to all members</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {canCreateTasks && !form.watch("assignToAll") && (
                <FormField
                  control={form.control}
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
} 