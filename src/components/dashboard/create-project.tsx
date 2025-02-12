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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProject } from "@/lib/actions/projects";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MultiSelect } from "@/components/ui/multi-select";
import { useUsers } from "@/hooks/use-users";

const predefinedColors = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  billable: z.boolean().default(false),
  billableAmount: z.number().optional(),
  members: z.array(z.string()).default([]),
});

export function CreateProject() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { data: users, isLoading, error } = useUsers();
  const [customColor, setCustomColor] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      billable: false,
      color: predefinedColors[0].value,
      members: [],
    },
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["create-project"],
    mutationFn: (values: z.infer<typeof projectSchema>) =>
      createProject({
        ...values,
        managerId: user!.id,
        members: values.members || [],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    try {
      await mutateAsync(values);

      toast.success("Project created successfully");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create project");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
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
                    <Textarea
                      placeholder="Enter project description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Color</FormLabel>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={customColor}
                        onCheckedChange={setCustomColor}
                      />
                      <span className="text-sm">Use custom color</span>
                    </div>
                    {customColor ? (
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                    ) : (
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-2"
                        >
                          {predefinedColors.map((color) => (
                            <div
                              key={color.value}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={color.value}
                                id={color.value}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={color.value}
                                className={cn(
                                  "flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                                  "cursor-pointer"
                                )}
                              >
                                <span
                                  className="h-4 w-4 rounded-full"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="ml-2 text-sm">
                                  {color.name}
                                </span>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    )}
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Billable</FormLabel>
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

            {form.watch("billable") && (
              <FormField
                control={form.control}
                name="billableAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billable Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Members</FormLabel>
                  <FormControl>
                    {isLoading ? (
                      <div>Loading users...</div>
                    ) : error ? (
                      <div>Error loading users</div>
                    ) : (
                      <MultiSelect
                        options={
                          users?.data.map((user: { id: string; username: string; email: string }) => ({
                            label: user.username || '',
                            value: user.id,
                            email: user.email,
                          })) ?? []
                        }
                        selected={field.value ?? []}
                        onChange={field.onChange}
                      />
                    )}
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
                "Create Project"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
