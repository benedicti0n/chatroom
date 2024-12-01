import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL

const Room = () => {
    const [ws, setWs] = useState<WebSocket | null>()
    const inputMessage = useRef<HTMLInputElement | null>(null)
    const [messages, setMessages] = useState<string[]>([])
    const { roomId } = useParams()
    const navigate = useNavigate()
    const location = useLocation();
    const userName = location.state?.userName;

    useEffect(() => {
        const socket = new WebSocket(`${websocketUrl}/${roomId}`)
        setWs(socket)

        socket.onopen = () => {
            if (roomId) {
                const payload = JSON.stringify({ roomId, userName })
                socket.send(payload)
                // if (userName) {
                //     socket.send(`User ${userName} has joined the room.`);
                // }
                toast(`Connected! Your room id: ${roomId}`)
            }
        }

        //this should be an event but for learning purposes lets name it as what it is
        socket.onmessage = (messageIncomingFromServer) => {
            const message = messageIncomingFromServer.data;
            setMessages((prevMessages) => [...prevMessages, message])
        }

        socket.onclose = () => {
            toast("Connection lost!")
            // navigate('/')
        }

        return () => socket.close()

    }, [roomId])

    const sendMessage = () => {
        if (ws?.readyState === ws?.OPEN) {
            const currentMessage = inputMessage.current?.value as string
            if (currentMessage.trim()) {
                ws?.send(currentMessage)
                inputMessage.current!.value = " "
            }
        }
    }
    return (
        <div className='min-h-screen w-full flex flex-col justify-center items-center'>
            <div className='flex flex-col w-full max-w-md bg-white rounded-lg shadow-lg p-4'>
                <div className='flex-grow overflow-y-auto mb-4' style={{ maxHeight: '300px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className='bg-gray-200 rounded-lg p-2 mb-2'>
                            {msg}
                        </div>
                    ))}
                </div>
                <div className='flex'>
                    <input
                        type="text"
                        placeholder='Enter a message'
                        ref={inputMessage}
                        className="border-2 border-gray-400 rounded-lg px-4 py-2 flex-grow mr-2 focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
                    />
                    <button
                        className='border-2 border-black rounded-lg px-4 py-2 hover:bg-black hover:text-white transition duration-300 shadow-lg'
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}

export default Room