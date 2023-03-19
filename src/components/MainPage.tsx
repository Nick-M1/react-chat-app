import Sidebar from "./left-layout/Sidebar";
import {useState} from "react";
import {User} from "firebase/auth";
import ChatScreen from "./open-chat/ChatScreen";

type Props = {
    user: User
}

export default function MainPage({ user }: Props) {
    const [selectedChatroomId, setSelectedChatroomId] = useState<string>('')

    return (
        <div className="md:overflow-y-hidden flex w-screen h-screen bg-neutral-800 text-white">
            <div className="hidden w-[20vw] md:block">
                <Sidebar user={user} selectedChatroomId={selectedChatroomId} setSelectedChatroomId={setSelectedChatroomId} />
            </div>
            { selectedChatroomId != '' ? (
                <div className="w-[70vw] md:overflow-y-scroll scrollbar md:pr-2 md:pl-24">
                    <ChatScreen user={user} selectedRoomId={selectedChatroomId} />
                </div>
            ) : (
                <div className="m-auto">
                    <h2 className="text-2xl font-semibold">
                        Click on a chat or create a new chat
                    </h2>
                </div>
            )}

        </div>
    )
}
