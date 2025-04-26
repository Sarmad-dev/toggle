"use client";
import { onboardingFormSchema } from "@/lib/validations/onboarding";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import OnboardingMembersSelect from "./onboarding-members-select";
import { Button } from "../ui/button";
import { Loader2, UploadCloudIcon } from "lucide-react";
import Image from "next/image";
import { createOrganization } from "@/lib/actions/organization";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const OnboardingForm = ({ formType }: { formType: "COMPACT" | "EXTEND" }) => {
  const router = useRouter();

  const [steps, setSteps] = useState<number>(1);
  const [orgLogo, setOrgLogo] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof onboardingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: undefined,
      membersId: [],
      projectInvitationCode: "",
    },
  });

  const onUploadChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // const fileData = await uploadFile(file as File, "org-logo", "organizations-logo");
    const imageUrl = URL.createObjectURL(file as File);
    console.log("IMAGE URL: ", imageUrl);
    form.setValue("logo", file as File);
    setOrgLogo(imageUrl);
  };

  const onSubmit = async (values: z.infer<typeof onboardingFormSchema>) => {
    try {
      const result = await createOrganization({
        name: values.name,
        description: values.description,
        logo: values.logo,
        membersId: values.membersId,
        projectInvitationCode: values.projectInvitationCode,
      });

      if (result.success) {
        toast.success("Organization created successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error as unknown as string);
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        {steps === 1 && (
          <>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Organization Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your organization name"
                      type="text"
                      className="h-[50px] bg-white dark:bg-secondary border-gray-200 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 shadow-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell us about your organization..."
                      className="bg-white dark:bg-secondary min-h-[150px] border-gray-200 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 shadow-sm resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <FormField
              name="logo"
              control={form.control}
              render={() => (
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Organization Logo
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={onUploadChange}
                        accept="image/*"
                      />
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                        {orgLogo ? (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                            <Image
                              src={orgLogo}
                              alt="Organization logo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-auto p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            onClick={() => inputRef.current?.click()}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <UploadCloudIcon className="h-8 w-8 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Click to upload
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG (max. 2MB)
                              </span>
                            </div>
                          </Button>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 pt-4">
              {formType === "EXTEND" && (
                <Button
                  variant="outline"
                  className="flex-1"
                  type="button"
                  onClick={() => setSteps((prev) => prev + 1)}
                >
                  Continue
                </Button>
              )}
              {formType === "COMPACT" && (
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Create Organization"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
        {formType === "EXTEND" && steps === 2 && (
          <>
            <FormField
              name="membersId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-3">
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Team Members
                  </FormLabel>
                  <FormControl>
                    <OnboardingMembersSelect field={field} />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                onClick={() => setSteps((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button
                type="button"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => setSteps((prev) => prev + 1)}
              >
                Continue
              </Button>
            </div>
          </>
        )}
        {formType === "EXTEND" && steps === 3 && (
          <>
            <FormField
              name="projectInvitationCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-200">
                    Project Invitation Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter invitation code (optional)"
                      type="text"
                      className="h-[50px] bg-white dark:bg-secondary border-gray-200 dark:border-gray-800 focus:border-indigo-500 dark:focus:border-indigo-500 shadow-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-rose-500" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-4 pt-4">
              <Button
                variant="outline"
                type="button"
                className=""
                onClick={() => setSteps((prev) => prev - 1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Organization"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
};

export default OnboardingForm;
