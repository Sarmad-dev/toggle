import * as z from "zod";

export const chatMessageSchema = z.object({
  content: z.string(),
  replyToId: z.string().optional()
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>; 