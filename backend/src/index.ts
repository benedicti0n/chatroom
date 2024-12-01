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
}

interface SystemMessage {
    type: 'NEW_USER' | 'LEAVE';
    message: string;
}

type IncomingMessage = JoinMessage | ChatMessage;
type OutgoingMessage = ChatMessage | SystemMessage;

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
    let userName = '';
    let roomId = '';

    ws.on('message', (msg: string) => {
        const message: IncomingMessage = JSON.parse(msg);

        switch (message.type) {
            case 'JOIN':
                userName = message.userName;
                roomId = message.roomId;

                const newUserMessage: SystemMessage = {
                    type: 'NEW_USER',
                    message: `${userName} joined the chat room ${roomId}`,
                };
                broadcast(JSON.stringify(newUserMessage), wss);
                break;

            case 'MESSAGE':
                const userMessage: ChatMessage = {
                    type: 'MESSAGE',
                    userName: message.userName,
                    textMessage: message.textMessage,
                };
                broadcast(JSON.stringify(userMessage), wss);
                break;
        }
    });

    ws.on('close', () => {
        const leaveMessage: SystemMessage = {
            type: 'LEAVE',
            message: `${userName} has left the chat room.`,
        };
        broadcast(JSON.stringify(leaveMessage), wss);
    });
});

const broadcast = (msg: string, wss: WebSocketServer) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg);
        }
    });
};



import cron from 'node-cron';

cron.schedule('*/10 * * * *', () => {
    console.log('Pinging server to keep it alive...');
});