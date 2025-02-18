"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { uploadFile } from "@/lib/storage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { prisma } from "@/lib/prisma";
import { useState, useEffect } from "react";
import { updateUser } from "@/lib/actions/user";
import { Spinner } from "@/components/ui";
import {
  getManagerProjects,
  getProjectMemberships,
  getProjects,
} from "@/lib/actions/projects";
import { getTeamMemberships } from "@/lib/actions/teams";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});
export function ProfileSettings() {
  const { user, isLoading: isUserLoading } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const { data: projectsData } = useQuery({
    queryKey: ["user-projects"],
    queryFn: async () => await getManagerProjects(),
  });

  const { data: membershipsData } = useQuery({
    queryKey: ["user-memberships"],
    queryFn: async () => await getProjectMemberships(),
  });

  const { data: teamsData } = useQuery({
    queryKey: ["user-teams"],
    queryFn: async () => await getTeamMemberships()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
      name: user?.name || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        name: user.name as string,
      });
      setPreview(user.image || "");
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let imageUrl = user?.image || "";

      if (selectedFile) {
        const fileData = await uploadFile(selectedFile, "avatars");
        imageUrl = fileData.url;
      }

      const updatedUser = await updateUser(user?.id as string, {
        username: values.username,
        name: values.name,
        image: imageUrl,
      });

      if (updatedUser.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error instanceof Error ? error.message : "Update failed");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (isUserLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Projects Created</h3>
          <p className="text-2xl font-bold">
            {projectsData?.data?.length || 0}
          </p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Project Memberships</h3>
          <p className="text-2xl font-bold">{membershipsData?.data?.length || 0}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="text-sm font-medium">Team Memberships</h3>
          <p className="text-2xl font-bold">{teamsData?.data?.length || 0}</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={preview || user?.image || ""} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                Upload Photo
              </Button>
            </div>
          </div>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
