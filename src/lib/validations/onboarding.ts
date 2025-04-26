import { z } from "zod";

export const onboardingFormSchema = z.object({
  name: z.string().min(3, "Name should be atleast 3 characters"),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(200, "Description should not exceed 200 characters"),
  logo: z
    .instanceof(File)
    .refine(
      (file) => ["image/png", "image/jpeg", "image/jpg"].includes(file.type),
      { message: "Invalid image file type" }
    ),
  membersId: z.array(z.string()).optional(),
  projectInvitationCode: z.string().optional(),
});
