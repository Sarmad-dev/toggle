"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Pencil, Check, X, Plus, Loader2 } from "lucide-react";
import type { ChatMessage, TaskWithTags } from "@/types/global";
import { Tag, User as PrismaUser } from "@prisma/client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { useUpdateTask } from "@/hooks/task/use-update-task";
import CustomInput from "../custom/custom-input";
import { useUser } from "@/hooks/use-user";
import { useSendTaskMessage } from "@/hooks/task/use-send-task-message";
import { useMutationState } from "@tanstack/react-query";

interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskWithTags | null;
  isManager: boolean;
  currentMembers: PrismaUser[];
  allUsers: PrismaUser[];
  activities: {
    id: string;
    content: string;
    createdAt: Date;
    user: PrismaUser;
  }[];
  chat: ChatMessage[];
  onAddMember: (taskId: string, userId: string[]) => Promise<void>;
  isPending: boolean;
}

export function TaskDetailDialog({
  open,
  onOpenChange,
  task,
  isManager,
  currentMembers,
  allUsers,
  activities,
  chat,
  onAddMember,
  isPending,
}: TaskDetailDialogProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | string[]>("");
  const [chatInput, setChatInput] = useState("");
  const [showUserSelect, setShowUserSelect] = useState(false);
  const { user } = useUser();
  const [localChat, setLocalChat] = useState<ChatMessage[]>(chat);

  // Sync localChat when prop chat changes
  useEffect(() => {
    setLocalChat(chat);
  }, [chat]);

  const varaibles = useMutationState({
    filters: { mutationKey: ["send-task-message"], status: "pending" },
    select: (mutation) => mutation.state.variables,
  });

  const { mutateAsync: sendTaskMessage, isPending: isSendMessagePending } =
    useSendTaskMessage();

  const { mutateAsync: updateTask, isPending: isUpdatePending } =
    useUpdateTask();
  if (!task) return null;

  // Inline edit logic
  const startEdit = (field: string, value: string | string[]) => {
    setEditField(field);
    setEditValue(value);
  };
  const saveEdit = async () => {
    await updateTask({
      taskId: task.id,
      field: editField!,
      value: editValue,
      userId: currentMembers.map((m) => m.id),
    });
    if (!isUpdatePending) {
      setEditField(null);
    }
  };

  const addMembers = async () => {
    await onAddMember(task.id, selectedMembers);
    if (!isPending) {
      setShowUserSelect(false);
    }
  };

  const onSendMessage = async () => {
    if (!task.id || !user) return;
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      content: trimmed,
      userId: user.id,
      projectId: task.id,
      createdAt: new Date(),
      fileUrl: null,
      fileName: null,
      fileType: null,
      replyTo: null,
      user: {
        id: user.id,
        username: user.username,
        image: user.image || null,
      },
      files: [],
      status: "pending",
    };
    setLocalChat((prev) => [...prev, optimisticMsg]);
    setChatInput("");
    try {
      const response = await sendTaskMessage({
        taskId: task.id,
        content: trimmed,
      });
      if (response?.success && response?.data) {
        const serverMsg = response.data;
        setLocalChat((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? {
                  ...optimisticMsg,
                  id: serverMsg.id,
                  createdAt: serverMsg.createdAt,
                  status: "delivered",
                }
              : msg
          )
        );
      }
    } catch {
      setLocalChat((prev) => prev.filter((msg) => msg.id !== tempId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-2xl font-bold flex-1">
              {task.name}
            </DialogTitle>
            <div className="flex gap-2 items-center">
              {currentMembers.map((m) => (
                <Avatar key={m.id} title={m.username} className="w-8 h-8">
                  <AvatarImage src={m.image || undefined} />
                  <AvatarFallback>{m.username?.[0]}</AvatarFallback>
                </Avatar>
              ))}
              {isManager && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowUserSelect(true)}
                  title="Add member"
                >
                  <Plus />
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{task.status}</Badge>
            <Badge variant="secondary">
              Priority:{" "}
              {editField === "priority" ? (
                <>
                  <select
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border rounded px-2 py-1"
                    disabled={isUpdatePending}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <Button size="icon" variant="ghost" onClick={saveEdit}>
                    <Check />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditField(null)}
                  >
                    <X />
                  </Button>
                </>
              ) : (
                <>
                  {task.priority}
                  {isManager && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => startEdit("priority", task.priority)}
                    >
                      <Pencil size={14} />
                    </Button>
                  )}
                </>
              )}
            </Badge>
            <Badge variant="secondary">
              Due:{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
            </Badge>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Description</span>
              {isManager && editField !== "description" && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    startEdit("description", task.description || "")
                  }
                >
                  <Pencil size={14} />
                </Button>
              )}
            </div>
            {editField === "description" ? (
              <div className="flex gap-2 mt-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  rows={3}
                  disabled={isUpdatePending}
                />
                <Button size="icon" variant="ghost" onClick={saveEdit}>
                  <Check />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditField(null)}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground mt-1 whitespace-pre-line min-h-[48px]">
                {task.description || "No description."}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Tags</span>
              {isManager && editField !== "tags" && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    startEdit("tags", task.tags.map((t) => t.name) || [])
                  }
                >
                  <Pencil size={14} />
                </Button>
              )}
            </div>
            {editField === "tags" ? (
              <div className="flex gap-2 mt-2">
                <Input
                  value={
                    Array.isArray(editValue) ? editValue.join(",") : editValue
                  }
                  onChange={(e) => {
                    setEditValue(
                      e.target.value.split(",").map((s: string) => s.trim())
                    );
                  }}
                  className="flex-1"
                  placeholder="Comma separated tags"
                  disabled={isUpdatePending}
                />
                <Button size="icon" variant="ghost" onClick={saveEdit}>
                  <Check />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditField(null)}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap mt-1">
                {(task.tags || []).length > 0 ? (
                  task.tags.map((tag: Tag, i: number) => (
                    <Badge
                      key={i}
                      style={{ background: tag.color || undefined }}
                    >
                      {tag.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No tags.</span>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Activity Section */}
        <div className="mt-6">
          <div className="font-semibold mb-2">Activity</div>
          <div className="max-h-32 overflow-y-auto border rounded p-2 bg-muted space-y-2">
            {activities?.length > 0 ? (
              activities?.map((act) => (
                <div key={act.id} className="flex items-center gap-2 text-xs">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={act.user.image || undefined} />
                    <AvatarFallback>{act.user.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{act.user.username}</span>
                  <span className="text-muted-foreground">{act.content}</span>
                  <span className="ml-auto text-muted-foreground">
                    {act.createdAt.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No activity yet.</div>
            )}
          </div>
        </div>
        {/* Chat Section */}
        <div className="mt-6">
          <div className="font-semibold mb-2">Task Chat</div>
          <div className="max-h-40 overflow-y-auto border rounded p-2 bg-muted space-y-2 mb-2">
            {localChat.length > 0 ? (
              localChat.map((msg) => (
                <div key={msg.id} className="flex items-start gap-2 text-sm">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={msg.user.image || undefined} />
                    <AvatarFallback>{msg.user.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{msg.user.username}</span>
                    <div className="text-muted-foreground text-xs">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No messages yet.</div>
            )}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (chatInput.trim()) {
                onSendMessage();
                setChatInput("");
              }
            }}
          >
            <CustomInput
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={isSendMessagePending}>
              Send
            </Button>
          </form>
        </div>
        {/* Add Member Modal (simple dropdown for now) */}
        {showUserSelect && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-4 rounded shadow-lg w-80">
              <div className="font-semibold mb-2 text-card-foreground">
                Add Member
              </div>
              <div className="flex flex-col gap-2">
                <Command>
                  <CommandInput placeholder="Search users..." />
                  <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup>
                      {allUsers
                        ?.filter(
                          (user) =>
                            !currentMembers.some(
                              (member) => member.id === user.id
                            )
                        )
                        .map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              if (selectedMembers.includes(user.id)) {
                                setSelectedMembers((prev) =>
                                  prev.filter((id) => id !== user.id)
                                );
                              } else {
                                setSelectedMembers((prev) => [
                                  ...prev,
                                  user.id,
                                ]);
                              }
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedMembers.includes(user.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => setShowUserSelect(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  variant="default"
                  onClick={addMembers}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
