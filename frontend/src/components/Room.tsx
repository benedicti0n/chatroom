import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL

const Room = () => {
    const [ws, setWs] = useState<WebSocket | null>()
    const inputMessage = useRef<HTMLInputElement | null>(null)
    const { roomId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const socket = new WebSocket(`${websocketUrl}/${roomId}`)
        setWs(socket)

        socket.onopen = () => {
            toast(`Connected! Your room id: ${roomId}`)
        }

        //this should be an event but for learning purposes lets name it as what it is
        socket.onmessage = (messageIncomingFromServer) => {
            console.log(messageIncomingFromServer.data);
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
            <input
                type="text"
                placeholder='Enter a message'
                ref={inputMessage}
                className="border-2 border-gray-400 rounded-lg px-4 py-2 mr-4"
            />
            <button
                className='border-2 border-black rounded-lg px-8 py-6 hover:bg-black hover:text-white transition duration-300'
                onClick={sendMessage}
            >
                Send Message
            </button>
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