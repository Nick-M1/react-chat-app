import {Dispatch, SetStateAction} from "react";
import dateFormatter from "../../utils/time-formatter";

type Props = {
    chatroom: ChatRoom

    selectedChatroomId: string
    setSelectedChatroomId: Dispatch<SetStateAction<string>>
}

export default function ChatroomSingle({ chatroom, selectedChatroomId, setSelectedChatroomId }: Props) {
    const isActive = selectedChatroomId == chatroom.id

    const enterChatHandler = () => {
        if (!isActive)
            setSelectedChatroomId(chatroom.id)
    }

    return (
        <div
            className={`flex items-center cursor-pointer p-4 break-words border-t border-gray-700 smooth-transition ${isActive ? 'bg-blue-600/10 hover:bg-blue-600/20 active:bg-blue-600/25' : 'bg-transparent hover:bg-white/5 active:bg-white/10'}`}
            onClick={enterChatHandler}
        >
            <img
                width={40}
                height={40}
                className="m-1 mr-4 rounded-full"
                src={chatroom.users[0].image}
                alt='profile pic'
            />
            <div className="ml-5">
                <p className="">{ chatroom.name }</p>
                <p className='text-sm text-gray-400'>{ chatroom.users[0].displayname } • { chatroom.timestamp != null && dateFormatter(chatroom.timestamp.toDate()) }</p>
            </div>
        </div>
    );
}