import {Dispatch, SetStateAction, useEffect} from "react";
import dateFormatter, {DateFormatterOptions} from "../../utils/time-formatter";
import toast from "react-hot-toast";

type Props = {
    chatroom: ChatRoom
    storeTimestamp: number

    selectedChatroom: ChatRoom | null
    setSelectedChatroom: Dispatch<SetStateAction<ChatRoom | null>>
}

export default function ChatroomSingle({ chatroom, storeTimestamp, selectedChatroom, setSelectedChatroom }: Props) {
    const isActive = selectedChatroom?.id == chatroom.id
    const hasNewMessage = chatroom.timestamp && storeTimestamp < chatroom.timestamp.toDate()

    // useEffect(() => {
    //     if (hasNewMessage && storeTimestamp + 5 > chatroom.timestamp.toDate().getTime()/1000)
    //         toast(`NEW MESSAGE from chat ${chatroom.name}`, {id: 'new-message'})
    // })

    const enterChatHandler = () => {
        if (!isActive)
            setSelectedChatroom(chatroom)
    }

    return (
        <div
            className={`flex items-center cursor-pointer px-4 py-2.5 break-words border-t border-gray-700 smooth-transition ${isActive ? 'bg-blue-600/10 hover:bg-blue-600/20 active:bg-blue-600/25' : 'bg-transparent hover:bg-white/5 active:bg-white/10'}`}
            onClick={enterChatHandler}
        >
            <img
                width={40}
                height={40}
                className="m-1 mr-4 rounded-full"
                src={chatroom.users[0].image}
                alt='profile pic'
            />
            <div className="ml-5 w-full">
                <div className='flex justify-between'>
                    <p className="">{ chatroom.name }</p>

                    <div className={`bg-teal-600 h-6 w-6 -mr-2.5 flex items-center justify-center rounded-full font-semibold  ${hasNewMessage ? 'block' : 'hidden'}`}>1</div>
                </div>
                <p className='text-sm text-gray-400'>{ chatroom.users[0].displayname } • { chatroom.timestamp != null && dateFormatter(chatroom.timestamp.toDate(), DateFormatterOptions.FULL) }</p>
            </div>
        </div>
    );
}