import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";

export interface ServerIO extends NetServer {
  io?: SocketServer;
}

export interface ResponseIO {
  socket: {
    server: ServerIO;
  };
}

export const socketConfig = {
  path: "/api/socketio",
}; 