import MessageSingle from "./MessageSingle";
import NewMessage from "./NewMessage";
import {User} from "firebase/auth";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {collection, doc, onSnapshot, query, orderBy, deleteDoc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import ChatScreenHeader from "./ChatScreenHeader";
import {AnimatePresence, motion} from "framer-motion";
import PopupCustom from "../shared-components/PopupCustom";
import {TrashIcon} from "@heroicons/react/24/outline";
import colorMapper from "../../utils/user-colors";

type Props = {
    user: User
    selectedChatroom: ChatRoom
    setMobileChatOpen: Dispatch<SetStateAction<boolean>>

    replyToMsgId: string | null
    setReplyToMsgId: Dispatch<SetStateAction<string | null>>
}

export default function ChatScreen({ user, selectedChatroom, setMobileChatOpen, replyToMsgId, setReplyToMsgId }: Props) {
    const [reactionsOpen, setReactionsOpen] = useState<string | null>(null)

    const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
    const [deleteMessagePopup, setDeleteMessagePopup] = useState(false)
    useEffect(() => {
        if (messageToDelete != null)
            setDeleteMessagePopup(true)
        }, [messageToDelete])


    const [messages, setMessages] = useState<Message[]>([])
    useEffect(() => {
        const messagesUnsub = onSnapshot(
            query(
                collection(db, "rooms", selectedChatroom.id, "messages"),
                orderBy('timestamp', 'desc')
            ),
            (doc) => {
                setMessages(doc.docs.map(dc => dc.data() as Message))
                console.log('NEW DATA')
            });
        return () => messagesUnsub()
    }, [selectedChatroom])


    const deleteMessageHandler = async() => {
        if (messageToDelete != null)
            await updateDoc(
                doc(db, "rooms", selectedChatroom.id, "messages", messageToDelete),
                { isDeleted: true }
            )
    }

    // Assign color to each person in room      //todo: USE MEMO
    const colorMap = new Map(
        selectedChatroom?.users.map((user, index) => [user.id, colorMapper(index)])
    )

    // Replies
    const replyToMessage= messages.find(msg => msg.id === replyToMsgId)
    const replyToMessageColor = typeof replyToMessage == 'undefined' ? undefined : colorMap.get(replyToMessage.user.id)

    return (
        <>
            <div className=''>
                <ChatScreenHeader selectedChatroom={selectedChatroom} setMobileChatOpen={setMobileChatOpen} />
                <div className='w-full py-1 px-0.5 md:px-3 overflow-y-scroll scrollbar scroll-smooth flex flex-col-reverse h-[80dvh] lg:h-[80vh]'>
                    <div id='end-of-messages' className={replyToMsgId != null ? 'py-8' : ''}></div>
                    <AnimatePresence
                        initial={false}
                        mode='popLayout'
                    >
                        {messages.map((message, index) => {
                            const isJoinedToPreviousMessageByDate = message.timestamp ? (index < messages.length-1 && message.timestamp.toDate().toDateString() == messages[index+1].timestamp.toDate().toDateString()) : true
                            const isJoinedToPreviousMessageByUser = index < messages.length-1 && message.user.id == messages[index+1].user.id
                            const messageItIsReplyingTo = typeof message.replyToMsgId != 'undefined' ? messages.find(msg => msg.id === message.replyToMsgId) : undefined

                            return (
                                <motion.div
                                    key={message.id}
                                    className={``}
                                    initial={{opacity: 0, y: 100}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, transition: {duration: 0.15}}}
                                >
                                    <MessageSingle
                                        key={message.id}
                                        message={message}
                                        selectedChatroomId={selectedChatroom.id}

                                        isJoinedToPreviousMessageByDate={isJoinedToPreviousMessageByDate}
                                        isJoinedToPreviousMessageByUser={isJoinedToPreviousMessageByUser}

                                        messageItIsReplyingTo={messageItIsReplyingTo}

                                        colorOfThisMessage={colorMap.get(message.user.id) || 'text-indigo-300'}
                                        colorOfMessageItIsReplyingTo={typeof messageItIsReplyingTo != 'undefined' ? colorMap.get(messageItIsReplyingTo.user.id) : undefined}

                                        user={user}
                                        setMessageToDelete={setMessageToDelete}
                                        setReplyToMsgId={setReplyToMsgId}

                                        reactionsOpen={reactionsOpen}
                                        setReactionsOpen={setReactionsOpen}
                                    />
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                <NewMessage
                    user={user}
                    selectedRoomId={selectedChatroom.id}
                    replyToMsgId={replyToMsgId}
                    setReplyToMsgId={setReplyToMsgId}
                    replyToMessage={replyToMessage}
                    replyToMessageColor={replyToMessageColor || 'indigo-300'}
                />
            </div>

            <PopupCustom
                modal={deleteMessagePopup}
                setModal={setDeleteMessagePopup}
                confirmHandler={deleteMessageHandler}
                titleText={'Delete Message'}
                descriptionText={'Are you sure you want to delete this message'}
                buttonText={'Delete'}
                IconImg={TrashIcon}
            />
        </>
    )
}