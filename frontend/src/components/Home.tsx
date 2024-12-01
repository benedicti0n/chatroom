import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()

    const createNewRoom = () => {
        const randomNumber = Math.floor(Math.random() * 10000)
        navigate(`/${randomNumber}`)
    }

    return (
        <div className='min-h-screen w-full flex justify-center items-center'>
            <button
                className='border-2 border-black rounded-lg px-8 py-6 hover:bg-black hover:text-white transition duration-300'
                onClick={createNewRoom}
            >
                Create a new chat room
            </button>
        </div>
    )
}

export default Home