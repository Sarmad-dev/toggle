import { Server } from "socket.io";
import { NextResponse } from "next/server";

const io = new Server({
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  path: "/api/socketio",
});

export async function GET() {
  if (!global.socketIO) {
    console.log("Initializing Socket.IO server...");
    global.socketIO = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      socket.on("join-user", (userId: string) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined`);
      });
    });
  }

  return new NextResponse("Socket.IO server running", {
    headers: {
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL!,
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export const dynamic = "force-dynamic"; 