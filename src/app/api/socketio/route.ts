import { NextResponse } from "next/server";
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

export async function GET() {
  try {
    // Get the raw HTTP server instance
    const httpServer = global.httpServer as NetServer;
    
    if (!httpServer) {
      console.error("HTTP server not found");
      return NextResponse.json(
        { error: "Socket.IO server not initialized" },
        { status: 500 }
      );
    }

    // Initialize Socket.IO if not already initialized
    if (!global.io) {
      global.io = new SocketIOServer(httpServer, {
        path: "/api/socketio",
        addTrailingSlash: false,
        cors: {
          origin: process.env.NEXT_PUBLIC_APP_URL,
          methods: ["GET", "POST"],
        },
      });

      global.io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("join-project", (projectId: string) => {
          socket.join(`project-${projectId}`);
        });

        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
      });
    }

    return NextResponse.json(
      { success: true, message: "Socket.IO server running" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Socket.IO initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize Socket.IO server" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; 