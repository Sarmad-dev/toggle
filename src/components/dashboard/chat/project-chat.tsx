"use client";

import { useEffect, useRef, useState } from "react";
import { RealtimeManager } from "@/lib/realtime";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessageFormData, chatMessageSchema } from "@/lib/validations/chat";
import {
  Send,
  Paperclip,
  X,
  Loader2,
  Reply,
  Check,
} from "lucide-react";
import type { OnlineUser, ChatMessage, FileIconConfig } from "@/types/global";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendMessage, getProjectMessages } from "@/lib/actions/chat";
import { uploadFile } from "@/lib/storage";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilePreviewModal } from "./file-preview-modal";
import Image from "next/image";
import { Spinner } from "@/components/ui";
import { chatConfig } from "@/lib/constants";
import { formatMessageDate } from "@/lib/utils";
import type { ProjectChatProps, FilePreview } from "@/types/global";

interface PresenceData {
  user_id: string;
  online_at: string;
}

export function ProjectChat({ projectId, members }: ProjectChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    type: string;
    name: string;
  } | null>(null);

  const form = useForm<ChatMessageFormData>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const queryClient = useQueryClient();

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getProjectMessages(projectId),
  });

  useEffect(() => {
    if (messagesData) {
      setMessages(messagesData.data || []);
    }
  }, [messagesData]);

  useEffect(() => {
    if (!user?.id || !projectId) return;

    RealtimeManager.subscribeToProject(projectId, user.id, {
      onMessage: (message) => {
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          const messageUser = members.find((m) => m.id === message.userId);
          const typedMessage: ChatMessage = {
            ...message,
            user: {
              id: message.userId,
              username: messageUser?.username || "Unknown User",
              image: messageUser?.image || null
            }
          };
          return exists ? prev : [...prev, typedMessage];
        });
      },
      onPresenceChange: (presence) => {
        const users = Object.values(presence)
          .flat()
          .map((p: unknown) => {
            const presenceData = p as PresenceData;
            return {
              userId: presenceData.user_id,
              lastSeen: new Date(presenceData.online_at),
              username:
                members.find((m) => m.id === presenceData.user_id)?.username ||
                "Unknown User",
            };
          });
        setOnlineUsers(users);
      },
    });

    return () => {
      RealtimeManager.unsubscribeFromProject(projectId);
    };
  }, [projectId, user?.id, members]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { mutateAsync: sendMessageMutation } = useMutation({
    mutationFn: sendMessage,
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["messages", projectId] });

      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        content: newMessage.content,
        createdAt: new Date(),
        userId: user?.id as string,
        projectId: newMessage.projectId,
        user: {
          id: user?.id as string,
          username: user?.username as string,
          image: user?.image as string,
        },
        fileUrl: newMessage.fileUrl as string,
        fileName: newMessage.fileName as string,
        fileType: newMessage.fileType as string,
      };

      // Add to messages immediately
      setMessages((prev) => [...prev, optimisticMessage]);
      
      // Reset form immediately after optimistic update
      form.reset();
      setSelectedFiles([]);
      setReplyTo(null);

      return { optimisticMessage };
    },
    onSuccess: (serverMessage, _, context) => {
      if (!serverMessage.success) {
        toast.error(serverMessage.error || "Failed to send message");
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== context?.optimisticMessage.id)
        );
        return;
      }

      const actualMessage: ChatMessage = {
        id: serverMessage.data?.id as string,
        content: serverMessage.data?.content as string,
        userId: serverMessage.data?.userId as string,
        projectId: serverMessage.data?.projectId as string,
        createdAt: new Date(serverMessage.data?.createdAt as Date),
        user: serverMessage.data?.user as {
          id: string;
          username: string;
          image: string | null;
        },
        fileUrl: serverMessage.data?.fileUrl || null,
        fileName: serverMessage.data?.fileName || null,
        fileType: serverMessage.data?.fileType || null,
        status: "delivered",
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === context?.optimisticMessage.id ? actualMessage : msg
        )
      );

      RealtimeManager.sendMessage(projectId, actualMessage);
    },
    onError: (_, __, context) => {
      // Remove failed message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== context?.optimisticMessage.id)
      );
    },
  });

  const onSubmit = async (data: ChatMessageFormData) => {
    try {
      if (!user) return;

      if (!data.content.trim() && !selectedFiles.length) {
        toast.error("Please enter a message or attach a file");
        return;
      }

      setIsSubmitting(true);

      let fileData = null;
      if (selectedFiles.length > 0) {
        const { file } = selectedFiles[0];
        fileData = await uploadFile(
          file,
          file.type.startsWith("image/") ? "images" : "documents"
        );
      }

      await sendMessageMutation({
        content: data.content,
        projectId,
        userId: user.id,
        fileUrl: fileData?.url,
        fileName: fileData?.fileName,
        fileType: fileData?.fileType,
        replyToId: replyTo?.id,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = files.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [selectedFiles]);

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
    form.setFocus("content");
  };

  const scrollToMessage = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      // Add a brief highlight effect
      element.classList.add("highlight-message");
      setTimeout(() => element.classList.remove("highlight-message"), 2000);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.user.id === user?.id;

    const fileIconConfig: FileIconConfig = chatConfig.fileIcons;
    const getFileIcon = (fileType: string) => {
      const IconComponent = fileIconConfig[
        Object.keys(fileIconConfig).find(key => fileType.includes(key)) || 'default'
      ];
      return <IconComponent className="h-8 w-8 text-muted-foreground" key={fileType} />;
    };

    if (isLoadingMessages) {
      return <Spinner />;
    }

    return (
      <div
        key={message.id}
        ref={(el) => {
          if (el) messageRefs.current[message.id] = el;
        }}
        className={cn(
          "group flex flex-col gap-1 mb-4",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        <div className="max-w-[80%]">
          {message.replyTo && (
            <div
              onClick={() => scrollToMessage(message.replyTo!.id)}
              className={cn(
                "flex items-start gap-2 p-2 rounded-t-lg border-l-4",
                isCurrentUser
                  ? "bg-primary/10 border-primary/20"
                  : "bg-background border-muted-foreground/20",
                "cursor-pointer hover:bg-muted/10"
              )}
            >
              <Reply className="h-3 w-3 mt-1 rotate-180" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary">
                  {message.replyTo?.user.username}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {message.replyTo?.content || "Attachment"}
                </span>
              </div>
            </div>
          )}

          <div
            className={cn(
              "p-3 rounded-lg",
              message.replyTo && "rounded-t-none",
              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{message.user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{message.user.username}</span>
              <span className="text-xs opacity-70">
                {formatMessageDate(new Date(message.createdAt))}
                {message.status === "delivered" && isCurrentUser && (
                  <Check className="h-3 w-3 ml-1 inline-block" />
                )}
                {message.status === "pending" && isCurrentUser && (
                  <Loader2 className="h-3 w-3 ml-1 inline-block animate-spin" />
                )}
              </span>
            </div>

            {message.content && (
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {message.fileUrl && (
              <div className="mt-2 relative">
                {message.fileType?.startsWith("image/") ? (
                  <div
                    style={chatConfig.imagePreviewStyle}
                    className="cursor-pointer"
                    onClick={() =>
                      setPreviewFile({
                        url: message.fileUrl!,
                        type: message.fileType!,
                        name: message.fileName || "Attached image",
                      })
                    }
                  >
                    <Image
                      src={message.fileUrl}
                      alt={message.fileName || "Attached image"}
                      layout="responsive"
                      width={16}
                      height={9}
                      objectFit="cover"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      setPreviewFile({
                        url: message.fileUrl!,
                        type: message.fileType!,
                        name: message.fileName || "Attached file",
                      })
                    }
                    className="flex items-center gap-2 p-2 bg-background/10 hover:bg-background/20 transition-colors rounded cursor-pointer"
                  >
                    {getFileIcon(message.fileType || "")}
                    <span className="text-sm truncate">
                      {message.fileName || "Attached file"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleReply(message)}
            >
              <Reply className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reply</TooltipContent>
        </Tooltip>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen border rounded-lg shadow-sm bg-background">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold">Project Chat</h3>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              {onlineUsers.length} online
            </p>
            <div className="flex -space-x-2">
              {onlineUsers.map((user) => (
                <Avatar
                  key={user.userId}
                  className="border-2 border-background w-6 h-6"
                >
                  <AvatarFallback className="text-xs">
                    {user.username[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages.length > 0 &&
            messages.map((message) => renderMessage(message))}
        </ScrollArea>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-4 border-t bg-muted/50"
        >
          {replyTo && (
            <div className="mb-2 p-2 rounded bg-muted flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Replying to {replyTo.user.username}
                </span>
                <span className="text-sm truncate text-muted-foreground">
                  {replyTo.content}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setReplyTo(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="p-2 border rounded-md bg-background"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{file.file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  {file.preview && (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "600px",
                        margin: "auto",
                      }}
                      className="cursor-pointer"
                    >
                      <Image
                        src={file.preview} // URL of the image from Supabase Storage
                        alt={"Preview"} // Alt text for accessibility
                        layout="responsive" // Ensures the image maintains its aspect ratio
                        width={16} // Placeholder value (will be overridden by intrinsic size)
                        height={9} // Placeholder value (will be overridden by intrinsic size)
                        objectFit="cover" // Ensures the image covers the container without distortion
                        priority={false} // Optional: Set to true if the image is above the fold
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type a message..."
                className="flex-1 resize-none min-h-[80px] bg-background"
                {...form.register("content")}
                onChange={(e) => {
                  form.register("content").onChange(e);
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={handleFileUpload}
                multiple
                accept={chatConfig.acceptedFileTypes}
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button type="submit" disabled={isSubmitting} className="px-4">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {previewFile && (
        <FilePreviewModal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          file={previewFile}
        />
      )}
    </>
  );
}
