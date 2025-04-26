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

import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi-select";
import { useGetOrganization } from "@/hooks/organization/use-get-organization";
import CreateOrganizationDialog from "./organization/create-organization-dialog";
import { createProjectFormSchema } from "@/lib/validations/project";
import { useCreateProject } from "@/hooks/projects/use-create-project";
import { MultiSelectOption, ProjectTask } from "@/types/global";
import CustomInput from "../custom/custom-input";
import CustomTextarea from "../custom/custom-textarea";
import { useUser } from "@/hooks/use-user";
import CustomCalendar from "../custom/custom-calendar";
import CreateTaksDialog from "../dialog/create-tasks-dialog";

const predefinedColors = [
  { name: "Red", value: "#ef4444" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#22c55e" },
  { name: "Purple", value: "#a855f7" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
];

export function CreateProject() {
  const { user } = useUser();
  const { organization, isLoading } = useGetOrganization();

  const [open, setOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [customColor, setCustomColor] = useState(false);

  const options = organization?.data?.members?.map((member) => ({
    label: member.user.name || member.user.username, // username
    value: member.user.id, // id
    email: member.user.email, // optional email for searching;
    imageUrl: member.user.image,
  })) as MultiSelectOption[];

  const { mutateAsync } = useCreateProject();

  const form = useForm<z.infer<typeof createProjectFormSchema>>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      billable: false,
      isUseAI: false,
      billableAmount: 0,
      color: predefinedColors[0].value,
      members: [],
      dueDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof createProjectFormSchema>) {
    try {
      const { data } = await mutateAsync(values);
      if (data?.tasks && data?.tasks.length > 0) {
        setTasks(data.tasks);
        setProjectId(data.project.id);
        setTaskOpen(true);
      }
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating project: ", error);
      toast.error("Failed to create project");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  if (isLoading) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {organization === undefined ? (
            <div></div>
          ) : !organization?.success ? (
            <CreateOrganizationDialog />
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          )}
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
                      <CustomInput
                        placeholder="Enter project name"
                        {...field}
                      />
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
                          <CustomInput
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
                            className="grid grid-cols-3 gap-2">
                            {predefinedColors.map((color) => (
                              <div
                                key={color.value}
                                className="flex items-center space-x-2">
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
                                  )}>
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
                        <CustomInput
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="isUseAI"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Use AI to suggest project tasks</FormLabel>
                    </div>
                    <FormControl>
                      <div className="group relative">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="absolute bg-primary px-0.5 rounded-sm w-max bottom-8 -left-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {user?.subscription?.status !== "ACTIVE" ||
                          user?.subscription?.plan !== "PRO" ? (
                            <span className="text-xs">
                              You need to be a PRO member to use AI features.
                            </span>
                          ) : (
                            ""
                          )}
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="members"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Members</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={options as MultiSelectOption[]}
                        selected={field.value ?? []}
                        onChange={field.onChange}
                        width="w-[450px]"
                      />
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
                    <CustomCalendar field={field} />
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
      <CreateTaksDialog
        open={taskOpen}
        setOpen={setTaskOpen}
        tasks={tasks}
        projectId={projectId as string}
      />
    </>
  );
}
