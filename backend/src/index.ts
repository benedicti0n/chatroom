import { WebSocketServer } from "ws";

const PORT = 8080

const wss = new WebSocketServer({ port: PORT })

wss.on("connection", (ws, req) => {
    const roomId = req.url?.split('/')[2];
    console.log(`Client connected to room: ${roomId}`);

    ws.on("message", (msg) => {
        console.log(`Received message from room ${roomId}: ${msg}`)

        const stringMessage = msg.toString()
        broadcast(stringMessage, wss)
    })
    ws.on("close", () => console.log("Disconnected"))
})

const broadcast = (msg: string, wss: WebSocketServer) => {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(msg)
        }
    });
}