"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io("http://localhost:3000", {
      transports: ["polling"],
      reconnection: true,
      path: "/api/socketio",
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      withCredentials: true,
      autoConnect: true,
      forceNew: true,
      timeout: 20000,
    });

    const handleConnect = () => {
      console.log("Socket connected:", socketIo.id);
      socketIo.io.opts.transports = ["polling", "websocket"];
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
      socketIo.io.opts.transports = ["polling"];
    };

    socketIo.on("connect", handleConnect);
    socketIo.on("connect_error", handleConnectError);

    setSocket(socketIo);

    return () => {
      socketIo.off("connect", handleConnect);
      socketIo.off("connect_error", handleConnectError);
      socketIo.disconnect();
    };
  }, []);

  const logout = (projectId: string, userId: string) => {
    if (socket) {
      socket.emit("user-logout", { projectId, userId });
      socket.disconnect();
    }
  };

  return { socket, logout };
}