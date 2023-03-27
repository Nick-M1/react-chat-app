import {REACTIONS} from "../../utils/reactions";
import {User} from "firebase/auth";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {Dispatch, SetStateAction} from "react";

type Props = {
    message: Message
    selectedChatroomId: string
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

export default function ReactionPopup({ message, selectedChatroomId, user, setReactionsOpen }: Props) {
    return (
        <div
            className={`z-[1] flex gap-1 rounded-full p-[6px] shadow bg-neutral-700 ml-1`}
        >
            {REACTIONS.map(({name, icon, gif}, index) => (
                <div
                    key={name}
                    className="after:bg-primary relative after:absolute after:left-1/2 after:top-full after:h-[5px] after:w-[5px] after:-translate-x-1/2 after:rounded-full"
                >
                    <img
                        onClick={async () => {
                            await updateReaction(selectedChatroomId, message.id, user.uid, index)
                            setReactionsOpen(null)
                        }}
                        title={name}
                        className={`h-7 w-7 origin-bottom cursor-pointer transition duration-300 hover:scale-[115%]`}
                        src={gif}
                        alt=""
                    />
                </div>
            ))}
        </div>
    );
}