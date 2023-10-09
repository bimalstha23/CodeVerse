import socketio from "socket.io-client";

export const socket_global = socketio(process.env.NEXT_PUBLIC_SOCKET_URL);
