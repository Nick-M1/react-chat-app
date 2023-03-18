import {Dispatch, SetStateAction} from "react";

type Props = {
    chatroom: ChatRoom
    setSelectedChatroomId: Dispatch<SetStateAction<string>>
}

export default function ChatroomSingle({ chatroom, setSelectedChatroomId }: Props) {
    const enterChatHandler = () => {
        setSelectedChatroomId(chatroom.id)
    }

    return (
        <div
            className="sidebarChat flex items-center cursor-pointer p-4 break-words bg-transparent hover:bg-white/5 duration-100 transform transition-all border-b-[1px] border-indigo-900"
            onClick={enterChatHandler}
        >
            <img
                width={56}
                height={56}
                className="z-0 m-1 mr-4 rounded-full"
                src={chatroom.users[0].image}
                alt='profile pic'
            />
            <div className="ml-5">
                <p className="">{ chatroom.users[0].displayname }</p>
            </div>
        </div>
    );
}