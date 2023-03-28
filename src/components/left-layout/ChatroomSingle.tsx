import {Dispatch, SetStateAction} from "react";
import dateFormatter, {DateFormatterOptions} from "../../utils/time-formatter";

type Props = {
    chatroom: ChatRoom
    hasNewMessage: boolean

    selectedChatroomId: string
    setSelectedChatroomId: Dispatch<SetStateAction<string>>
}

export default function ChatroomSingle({ chatroom, hasNewMessage, selectedChatroomId, setSelectedChatroomId }: Props) {
    const isActive = selectedChatroomId == chatroom.id
    // console.log(chatroom.id, chatroom.timestamp, hasNewMessage)

    const enterChatHandler = () => {
        if (!isActive)
            setSelectedChatroomId(chatroom.id)
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