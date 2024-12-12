import React from 'react'

interface IButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    onClick: () => void;
    children: React.ReactNode;
}

const Button: React.FC<IButtonProps> = ({ variant = 'primary', onClick, children }) => {
    return (
        <div
            className={`button ${buttonStyles[variant]}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}

// Tailwind CSS classes for styling
const buttonStyles: Record<'primary' | 'secondary' | 'danger', string> = {
    primary: 'bg-black text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 rounded-lg px-4 py-2 text-base md:text-lg transition duration-200 text-center',
    secondary: 'bg-white text-black border border-black hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 rounded-lg px-4 py-2 text-base md:text-lg transition duration-200 text-center',
    danger: 'bg-red-600 text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 rounded-lg px-4 py-2 text-base md:text-lg transition duration-200 text-center',
}

export default Button