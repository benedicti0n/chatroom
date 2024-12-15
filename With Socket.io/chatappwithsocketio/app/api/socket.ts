import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net"; // Import the Node.js Socket type

// Extend the NextApiResponse type to include socket with server and io
interface NextApiResponseWithSocket extends NextApiResponse {
    socket: NetSocket & { // Use intersection to include NetSocket properties
        server: HTTPServer & {
            io?: SocketIOServer;
        };
    };
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
    if (res.socket && !res.socket.server.io) {
        console.log("Starting socket io server");
        const io = new SocketIOServer(res.socket.server);
        res.socket.server.io = io;

        io.on("connection", (socket: Socket) => {
            console.log("New user connected: ", socket.id);

            socket.on("message", (msg: string) => {
                socket.broadcast.emit("message", msg);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected: ", socket.id);
            });

            socket.on("error", (error: Error) => {
                console.error("Socket error: ", error);
            });
        });
    }

    res.status(200).json({ message: "Socket server is running" });
}
