interface INewUserBubbleProps {
    key: number;
    notification: string;
}

const NewUserBubble: React.FC<INewUserBubbleProps> = ({ key, notification }) => {
    return (
        <div key={key} className="bg-cyan-100 text-teal-800 p-3 rounded-lg shadow-md my-2 text-center">
            <span className="font-bold">{notification}</span>
        </div>
    )
}

export default NewUserBubble