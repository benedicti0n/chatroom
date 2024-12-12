import { WebSocket, WebSocketServer } from 'ws';

interface JoinMessage {
    type: 'JOIN';
    userName: string;
    roomId: string;
}

interface ChatMessage {
    type: 'MESSAGE';
    userName: string;
    textMessage: string;
    roomId: string;
}

interface SystemMessage {
    type: 'NEW_USER' | 'LEAVE';
    message: string;
}

type IncomingMessage = JoinMessage | ChatMessage;
type OutgoingMessage = ChatMessage | SystemMessage;

// Track clients and their room IDs
const clients: Map<WebSocket, { roomId: string; userName: string }> = new Map();

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (msg: string) => {
        const message: IncomingMessage = JSON.parse(msg);

        switch (message.type) {
            case 'JOIN':
                clients.set(ws, { roomId: message.roomId, userName: message.userName });

                const newUserMessage: SystemMessage = {
                    type: 'NEW_USER',
                    message: `${message.userName} joined the chat room ${message.roomId}`,
                };

                broadcast(JSON.stringify(newUserMessage), message.roomId);
                break;

            case 'MESSAGE':
                const userMessage: ChatMessage = {
                    type: 'MESSAGE',
                    userName: message.userName,
                    textMessage: message.textMessage,
                    roomId: message.roomId,
                };

                broadcast(JSON.stringify(userMessage), message.roomId);
                break;
        }
    });

    ws.on('close', () => {
        const clientInfo = clients.get(ws);
        if (clientInfo) {
            const leaveMessage: SystemMessage = {
                type: 'LEAVE',
                message: `${clientInfo.userName} has left the chat room.`,
            };

            broadcast(JSON.stringify(leaveMessage), clientInfo.roomId);
            clients.delete(ws);
        }
    });
});

// Broadcast message only to clients in the specified room
const broadcast = (msg: string, roomId: string) => {
    wss.clients.forEach((client) => {
        const clientInfo = clients.get(client);
        if (clientInfo && clientInfo.roomId === roomId && client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
};
