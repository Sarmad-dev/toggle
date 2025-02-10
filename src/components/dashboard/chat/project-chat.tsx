"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatMessageFormData, chatMessageSchema } from "@/lib/validations/chat";
import { format } from "date-fns";
import { Send, Paperclip, X, Loader2, FileText, FileSpreadsheet, Presentation, File, Reply, ChartPie } from "lucide-react";
import type { OnlineUser, ChatMessage } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendMessage, getProjectMessages } from "@/lib/actions/chat";
import { uploadFile } from '@/lib/storage';
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { FilePreviewModal } from "./file-preview-modal";

interface ProjectChatProps {
  projectId: string;
  members: {
    id: string;
    username: string;
    image?: string;
  }[];
}

interface FilePreview {
  file: File;
  preview: string;
}

// Add this type to help with message organization
interface MessageWithReplies extends ChatMessage {
  replies?: MessageWithReplies[];
}

export function ProjectChat({ projectId, members }: ProjectChatProps) {
  const { user } = useUser();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
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

  const { data: messagesData } = useQuery({
    queryKey: ["messages", projectId],
    queryFn: () => getProjectMessages(projectId),
  });

  useEffect(() => {
    if (messagesData?.success) {
      setMessages(messagesData.data || []);
    }
  }, [messagesData]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket || !user) return;

    console.log("Joining project chat:", projectId);
    socket.emit("join-project-chat", { 
      projectId, 
      userId: user.id,
      username: user.username 
    });

    const handleMessage = (message: ChatMessage) => {
      console.log("Received message:", message);
      setMessages(prev => [...prev, message]);
    };

    const handleOnlineUsers = (users: OnlineUser[]) => {
      console.log("Online users updated:", users);
      setOnlineUsers(users);
    };

    socket.on("receive-message", handleMessage);
    socket.on("online-users", handleOnlineUsers);

    socket.on("user-typing", ({ username }) => {
      console.log(`${username} is typing...`);
      if (username !== user.username) {
        setTypingUser(username);
      }
    });

    socket.on("user-stopped-typing", ({ username }) => {
      console.log(`${username} stopped typing`);
      if (username !== user.username) {
        setTypingUser(null);
      }
    });

    // Create cleanup function
    const cleanup = () => {
      try {
        if (socket && typeof socket.emit === 'function') {
          socket.emit("leave-project-chat", { projectId });
        }
        if (socket && typeof socket.removeListener === 'function') {
          socket.removeListener("receive-message", handleMessage);
          socket.removeListener("online-users", handleOnlineUsers);
          socket.removeListener("user-typing");
          socket.removeListener("user-stopped-typing");
        }
      } catch (error) {
        console.error("Error during socket cleanup:", error);
      }
    };

    return cleanup;
  }, [socket, user, projectId]);

  const onSubmit = async (data: ChatMessageFormData) => {
    try {
      if (!user) return;
      
      if (!data.content.trim() && !selectedFiles.length) {
        return;
      }

      setIsSubmitting(true);

      let fileData = null;
      if (selectedFiles.length > 0) {
        const { file } = selectedFiles[0];
        fileData = await uploadFile(file, file.type.startsWith('image/') ? 'images' : 'documents');
      }

      await sendMessage({
        content: data.content,
        projectId,
        userId: user.id,
        fileUrl: fileData?.url,
        fileName: fileData?.fileName,
        fileType: fileData?.fileType,
        replyToId: replyTo?.id
      });

      form.reset();
      setSelectedFiles([]);
      setReplyTo(null);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypingStart = () => {
    if (socket && user && !isTyping) {
      console.log("Emitting typing start");
      setIsTyping(true);
      socket.emit("typing-start", { 
        projectId, 
        username: user.username 
      });
    }
  };

  const handleTypingEnd = () => {
    if (socket && user && isTyping) {
      console.log("Emitting typing end");
      setIsTyping(false);
      socket.emit("typing-end", { 
        projectId,
        username: user.username 
      });
    }
  };

  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.register("content").onChange(e);

    if (value.length > 0) {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      handleTypingStart();
      
      typingTimeout.current = setTimeout(() => {
        handleTypingEnd();
      }, 1000);
    } else {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      handleTypingEnd();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles = files.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : ''
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
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
      selectedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const handleReply = (message: ChatMessage) => {
    setReplyTo(message);
    form.setFocus("content");
  };

  const scrollToMessage = (messageId: string) => {
    const element = messageRefs.current[messageId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isCurrentUser = message.user.id === user?.id;

    const getFileIcon = (fileType: string) => {
      if (fileType.includes('pdf')) {
        return <FileText className="h-8 w-8 text-red-500" />;
      } else if (fileType.includes('msword')) {
        return <FileText className="h-8 w-8 text-blue-700" />;
      } else if (fileType.includes('sheet')) {
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      } else if (fileType.includes('presentation')) {
        return <ChartPie className="h-8 w-8 text-orange-500" />;
      }
      return <File className="h-8 w-8 text-gray-500" />;
    };

    return (
      <div 
        key={message.id}
        ref={el => {
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
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback>{message.user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {message.user.username}
              </span>
              <span className="text-xs opacity-70">
                {format(new Date(message.createdAt), "p")}
              </span>
            </div>

            {message.content && (
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
            
            {message.fileUrl && (
              <div className="mt-2">
                {message.fileType?.startsWith('image/') ? (
                  <img
                    src={message.fileUrl}
                    alt={message.fileName || 'Attached image'}
                    className="max-h-48 w-full object-cover rounded-md cursor-pointer"
                    onClick={() => setPreviewFile({
                      url: message.fileUrl!,
                      type: message.fileType!,
                      name: message.fileName || 'Attached image'
                    })}
                  />
                ) : (
                  <div
                    onClick={() => setPreviewFile({
                      url: message.fileUrl!,
                      type: message.fileType!,
                      name: message.fileName || 'Attached file'
                    })}
                    className="flex items-center gap-2 p-2 bg-background/10 hover:bg-background/20 transition-colors rounded cursor-pointer"
                  >
                    {getFileIcon(message.fileType || '')}
                    <span className="text-sm truncate">
                      {message.fileName || 'Attached file'}
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
      <div className="flex flex-col h-[calc(100vh-200px)] border rounded-lg shadow-sm bg-background">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold">Project Chat</h3>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-sm text-muted-foreground">
              {onlineUsers.length} online
            </p>
            <div className="flex -space-x-2">
              {onlineUsers.map((user) => (
                <Avatar key={user.userId} className="border-2 border-background w-6 h-6">
                  <AvatarFallback className="text-xs">{user.username[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages && messages.map(message => renderMessage(message))}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Someone is typing...</span>
            </div>
          )}
        </ScrollArea>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border-t bg-muted/50">
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
                <div key={index} className="p-2 border rounded-md bg-background">
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
                    <img 
                      src={file.preview} 
                      alt="Preview" 
                      className="mt-2 h-32 w-full rounded-md object-cover"
                    />
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
                  onMessageChange(e);
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
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                type="submit" 
                disabled={(!form.getValues("content").trim() && !selectedFiles.length) || isSubmitting}
                className="px-4"
              >
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