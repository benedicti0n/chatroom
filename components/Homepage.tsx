"use client"
import React from 'react'

const Homepage = () => {
    const createRoom = () => {
        window.location.href = "/api/socket"
    }

    return (
        <div>
            <button className='border-2 rounded-lg border-white px-6 py-4 text-white' onClick={createRoom}>
                Create room
            </button>
        </div>
    )
}

export default Homepage