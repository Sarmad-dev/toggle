import { Server } from "socket.io";
import { NextResponse } from "next/server";
import type { NextApiResponseServerIO } from "@/lib/socket";

let io: Server;

export async function GET(req: Request, res: NextApiResponseServerIO) {
  if (!io) {
    io = new Server(res.socket.server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["polling"],
      connectionStateRecovery: {
        maxDisconnectionDuration: 2000
      }
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // Add your other socket event handlers here
    });

    res.socket.server.io = io;
  }

  return new NextResponse("Socket.IO server running", { 
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST",
    }
  });
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; 