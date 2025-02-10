import { Server } from "socket.io";

declare global {
  var socketIO: Server | undefined;
  
  namespace NodeJS {
    interface Global {
      socketIO: Server | undefined;
    }
  }
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  projectId: string;
  createdAt: Date;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  replyTo?: {
    id: string;
    content: string;
    user: {
      username: string;
    };
  } | null;
  user: {
    id: string;
    username: string;
    image: string | null;
  };
  files?: {
    url: string;
    fileName: string;
    fileType: string;
  }[];
}

export interface OnlineUser {
  userId: string;
  username: string;
  lastSeen: Date;
}

export interface ProjectChat {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
} 