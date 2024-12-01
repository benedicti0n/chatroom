import React from 'react';

interface IMessageProps {
    key: number;
    userName: string;
    textMessage: string;
}

const MessageBubble: React.FC<IMessageProps> = ({ userName, textMessage }) => {
    return (
        <div className="bg-gray-200 rounded-lg p-3 mb-2 max-w-[80%] shadow-md">
            <strong className="font-bold block mb-1">{userName}</strong>
            <p className="m-0">{textMessage}</p>
        </div>
    )
}

export default MessageBubble