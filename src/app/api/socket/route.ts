import { Server } from "socket.io";
import { NextResponse } from "next/server";
import type { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/lib/socket";

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ["GET", "POST"],
      },
    });
    
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("join-user", (userId: string) => {
        socket.join(`user-${userId}`);
      });
    });
  }

  return NextResponse.json({ success: true });
};

export const GET = ioHandler;
export const POST = ioHandler; 