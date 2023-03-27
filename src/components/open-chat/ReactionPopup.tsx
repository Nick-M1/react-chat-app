import {REACTIONS} from "../../utils/reactions";
import {User} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {Dispatch, SetStateAction} from "react";

type Props = {
    message: Message
    selectedChatroomId: string
    isSender: boolean
    user: User

    setReactionsOpen: Dispatch<SetStateAction<string | null>>
}

async function updateReaction(chatroomId: string, messageId: string, userId: string, value: number) {
     await updateDoc(
        doc(db, "rooms", chatroomId, "messages", messageId), {
            [`reactions.${userId}`]: value
        }
    )
}

export default function ReactionPopup({ message, selectedChatroomId, user, isSender, setReactionsOpen }: Props) {
    return (
        <div className={`absolute z-[1] flex md:gap-x-1 rounded-full shadow bg-neutral-700 ml-1 -translate-y-12 ${isSender ? 'right-0 translate-x-28' : 'left-0 -translate-x-24'}`}
        >
            {REACTIONS.map(({name, icon, gif}, index) => (
                <div
                    key={name}
                    className="flex flex-shrink-0 w-7 h-7 md:w-9 md:h-10 items-center content-center justify-center align-middle"
                >
                    <img
                        onClick={async () => {
                            await updateReaction(selectedChatroomId, message.id, user.uid, index)
                            setReactionsOpen(null)
                        }}
                        title={name}
                        className={`h-6 w-6 md:h-7 md:w-7 cursor-pointer transition duration-300 hover:scale-[115%]`}
                        src={gif}
                        alt=""
                    />
                </div>
            ))}
        </div>
    );
}