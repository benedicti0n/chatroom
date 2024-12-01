import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Button from '../ui/Button';
import 'react-toastify/dist/ReactToastify.css';
import MessageBubble from '../ui/MessageBubble';
import NewUserBubble from '../ui/NewUserBubble';

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL;

interface IMessageJson {
    type: 'NEW_USER' | 'MESSAGE' | 'LEAVE';
    userName?: string;
    textMessage?: string;
    message?: string;
}

const Room = () => {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const inputMessage = useRef<HTMLInputElement | null>(null);
    const [messageJson, setMessageJson] = useState<IMessageJson[]>([]);
    const location = useLocation();
    const { userName } = location.state || {};
    const [nameInput, setNameInput] = useState(userName || '');
    const { roomId } = useParams();
    const [showModal, setShowModal] = useState(!userName);
    const navigate = useNavigate();

    useEffect(() => {
        if (!showModal && roomId && nameInput) {
            const socket = new WebSocket(`${websocketUrl}/${roomId}`);
            setWs(socket);

            socket.onopen = () => {
                socket.send(JSON.stringify({ type: 'JOIN', roomId, userName: nameInput }));
                toast(`Connected! Welcome to room ${roomId}`);
            };

            socket.onmessage = (messageIncomingFromServer) => {
                const message = JSON.parse(messageIncomingFromServer.data);
                setMessageJson((prevMessages) => [...prevMessages, message]);
            };

            socket.onclose = () => toast('Connection lost!');

            return () => socket.close();
        }
    }, [showModal, roomId, nameInput]);

    const sendMessage = () => {
        if (ws?.readyState === WebSocket.OPEN) {
            const currentMessage = inputMessage.current?.value.trim();
            if (currentMessage) {
                ws.send(JSON.stringify({
                    type: 'MESSAGE',
                    userName: nameInput,
                    textMessage: currentMessage,
                }));
                inputMessage.current!.value = '';
            }
        }
    };

    const handleJoin = () => {
        if (nameInput.trim()) {
            setShowModal(false);
        } else {
            toast('Please enter your name!');
        }
    };

    const handleLeave = () => {
        if (ws) {
            ws.send(JSON.stringify({ type: 'LEAVE', userName: nameInput }));
            ws.close();
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-80">
                        <h2 className="text-xl font-bold mb-4 text-center">Enter Your Name</h2>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="border-2 border-gray-400 rounded-lg px-4 py-2 w-full"
                        />
                        <Button variant='primary' onClick={handleJoin}>Join Room</Button>
                    </div>
                </div>
            )}

            {!showModal && (
                <div className="flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4">
                    <div className="flex-grow overflow-y-auto mb-4">
                        {messageJson.map((msg, index) =>
                            msg.type === 'NEW_USER' || msg.type === 'LEAVE' ?
                                <NewUserBubble key={index} notification={msg.message!} /> :
                                <MessageBubble key={index} userName={msg.userName!} textMessage={msg.textMessage!} />
                        )}
                    </div>
                    <div className="flex mb-2">
                        <input ref={inputMessage} placeholder="Enter a message" className="border-2 flex-grow" />
                        <Button variant="secondary" onClick={sendMessage}>Send</Button>
                    </div>
                    <Button variant='danger' onClick={handleLeave}>Leave Room</Button>
                </div>
            )}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Room;
