import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'
import { ToastContainer, toast } from 'react-toastify'

const Home = () => {
    const nameInput = useRef<HTMLInputElement | null>(null)
    const navigate = useNavigate()

    const createNewRoom = () => {
        const randomNumber = Math.floor(Math.random() * 10000)
        const userName = nameInput.current?.value
        if (userName?.trim()) {
            navigate(`/${randomNumber}`, { state: { userName } })
        } else {
            toast("Please enter a name")
        }
    }

    return (
        <div className='min-h-screen w-full flex flex-col justify-center items-center'>
            <input
                type="text"
                placeholder='Enter your name'
                ref={nameInput}
                className='border-2 border-gray-400 rounded-lg px-4 py-2 m-2 focus:outline-none focus:ring-2 focus:ring-black transition duration-200'
            />
            <Button variant='primary' onClick={createNewRoom}>
                Create a new room
            </Button>
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

export default Home