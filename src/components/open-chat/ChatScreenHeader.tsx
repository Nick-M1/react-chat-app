import {ArrowLeftIcon} from "@heroicons/react/24/outline";
import {Dispatch, SetStateAction} from "react";

type Props = {
    selectedChatroom: ChatRoom | undefined
    setMobileChatOpen: Dispatch<SetStateAction<boolean>>
}

export default function ChatScreenHeader({ selectedChatroom, setMobileChatOpen }: Props) {
    if (selectedChatroom == null)
        return <div>ERROR</div>

    return (
        <div className="sticky top-0 z-30 flex items-center h-20 p-4 border-b border-gray-700">
            <ArrowLeftIcon
                onClick={() => setMobileChatOpen(false)}
                className="w-6 h-6 mr-2 cursor-pointer md:!hidden focus:outline-none text-gray-50"
            />
            <img
                width={56}
                height={56}
                className="z-0 m-1 mr-4 rounded-full"
                src={selectedChatroom.users[0].image}
                alt='Chat image'
            />

            <div className="flex-1 ml-4">
                <h3 className="mb-1 text-white">
                    <p>{selectedChatroom.users[0].displayname}</p>
                </h3>
                <p className="text-sm text-gray-100">
                    Last active: {""}
                    {/*{recipient?.lastSeen?.toDate() ? (*/}
                    {/*    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />*/}
                    {/*) : (*/}
                    {/*    "Unavailable"*/}
                    {/*)}*/}
                </p>
            </div>
        </div>
    );
}