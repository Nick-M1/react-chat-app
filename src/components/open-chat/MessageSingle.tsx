import React, {Dispatch, Key, SetStateAction} from "react";
import {User} from "firebase/auth";
import {FaceSmileIcon, TrashIcon} from "@heroicons/react/24/outline";
import Linkify from 'react-linkify';
import dateFormatter, {DateFormatterOptions} from "../../utils/time-formatter";
import {BsReplyFill} from "react-icons/bs";
import {classNames} from "../../utils/textUtils";
import smoothScroll from "../../utils/smooth-scroll";
import {SecureLink} from "react-secure-link";
import ReactionPopup from "./ReactionPopup";
import {REACTIONS} from "../../utils/reactions";
import ReactionStatus from "./ReactionStatus";


type Props = {
    message: Message
    selectedChatroomId: string

    isJoinedToPreviousMessageByDate: boolean
    isJoinedToPreviousMessageByUser: boolean
    messageItIsReplyingTo: Message | undefined

    colorOfThisMessage: string
    colorOfMessageItIsReplyingTo: string | undefined

    setMessageToDelete: Dispatch<SetStateAction<string | null>>
    setReplyToMsgId: Dispatch<SetStateAction<string | null>>

    reactionsOpen: string | null
    setReactionsOpen: Dispatch<SetStateAction<string | null>>

    user: User
}

const scrollToReplyOriginal = (otherMessageId: string) => {
    smoothScroll(otherMessageId, 'nearest', true)
}

export default function MessageSingle({ message, selectedChatroomId, isJoinedToPreviousMessageByDate, isJoinedToPreviousMessageByUser, colorOfThisMessage, colorOfMessageItIsReplyingTo, messageItIsReplyingTo, setMessageToDelete, setReplyToMsgId, reactionsOpen, setReactionsOpen, user }: Props) {
    const isSender = user?.uid == message.user.id
    const reactionsSelectorShow = reactionsOpen == message.id

    const reactionsCounter = REACTIONS.map(_ => 0)
    if (message.reactions)          //todo: Remove if
        Object.values(message.reactions).forEach(r => reactionsCounter[r]++)
    const reactionsDisplayShow = !message.isDeleted && reactionsCounter.some(p => p != 0)

    return (
        <>
            { !isJoinedToPreviousMessageByDate &&
                <div className='w-full py-2 flex justify-center'>
                    <div className='px-3 py-1 rounded-full bg-emerald-400/30 text-sm italic opacity-70'>
                        { message.timestamp != null && dateFormatter(message.timestamp.toDate(), DateFormatterOptions.DATE_ONLY) }
                    </div>
                </div>
            }

            <div className='group flex w-full md:min-w-[80px] md:pr-3 transition duration-500 ease-out' id={message.id}>
                <div className={`hidden relative group-hover:flex my-auto smooth-transition ${isSender ? 'ml-auto mr-3' : 'order-last'}`}>
                    { !message.isDeleted && (
                        <>
                            { isSender && <TrashIcon
                                className="my-auto w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                                onClick={() => setMessageToDelete(message.id)}
                            />}
                            <BsReplyFill
                                className="my-auto w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                                onClick={() => setReplyToMsgId(message.id)}
                            />
                            <FaceSmileIcon
                                className="my-auto w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                                onClick={() => setReactionsOpen(prevState => prevState != message.id ? message.id : null)}
                            />
                            { reactionsSelectorShow && <ReactionPopup selectedChatroomId={selectedChatroomId} message={message} user={user} isSender={isSender} setReactionsOpen={setReactionsOpen}/> }
                        </>
                    )}
                </div>

                <div
                    style={{ width: "fit-content" }}
                    className={
                        classNames(
                            'flex-shrink-0 px-2 pt-2 rounded-lg mx-3 min-w-[100px] md:min-w-[85px] max-w-[70dvw] md:max-w-[65dvw] min-h-[40px] relative text-left break-all text-white',
                            isSender
                                ? "ml-auto group-hover:ml-0 bg-indigo-900 text-left"
                                : "bg-neutral-700 text-left",
                            isJoinedToPreviousMessageByUser ? 'mt-0.5' : 'mt-2',
                            reactionsDisplayShow ? 'pb-2.5' : 'pb-2.5',
                    )}
                >
                    <div>
                        { message.isDeleted ? (
                            <>
                                {!isSender && !isJoinedToPreviousMessageByUser &&
                                    <>
                                        <span className={`text-${colorOfThisMessage}`}>{message.user.displayname}</span>
                                        <br/>
                                    </>
                                }
                                <span className='italic text-gray-300'>This message was deleted</span>

                            </>
                        ) : (
                            <>
                                { message.replyToMsgId != null &&
                                    <div onClick={() => scrollToReplyOriginal(message.replyToMsgId!)}
                                        className='-mx-2 mb-2 bg-neutral-800/40 hover:bg-neutral-800/60 opacity-90 smooth-transition min-w-[25dvw] max-h-[10dvh] overflow-x-clip overflow-y-clip scrollbar rounded-lg flex cursor-pointer'
                                    >
                                        <div className={`w-1.5 bg-${colorOfMessageItIsReplyingTo} rounded-lg mr-2 flex-shrink-0`}/>
                                        <div className='p-1 italic text-gray-300 text-sm line-clamp-3'>
                                            <span className={`text-${colorOfMessageItIsReplyingTo}`}>{ messageItIsReplyingTo?.user.displayname }</span>
                                            <br/>
                                            { messageItIsReplyingTo?.text }
                                        </div>

                                        { messageItIsReplyingTo?.attachedFileUrl && <img src={messageItIsReplyingTo?.attachedFileUrl} alt='attachment' className='max-h-[10dvh] max-w-[10dvw] ml-auto items-end'/> }
                                    </div>
                                }

                                {!isSender && !isJoinedToPreviousMessageByUser &&
                                    <>
                                        <span className={`text-${colorOfThisMessage}`}>{message.user.displayname}</span>
                                        <br/>
                                    </>
                                }

                                { message.attachedFileUrl && <img src={message.attachedFileUrl} alt='attachment' className='w-full h-full max-w-[50dvw] max-h-[50dvh] mb-1'/> }

                                <span className='pl-1 pr-6'>
                                    <Linkify
                                        componentDecorator={(
                                            decoratedHref: string,
                                            decoratedText: string,
                                            key: Key
                                        ) => (
                                            <SecureLink href={decoratedHref} key={key} className={`underline ${isSender ? 'text-cyan-400 hover:text-indigo-300 active:text-indigo-400' : 'text-blue-400 hover:text-blue-500 active:text-blue-600'}`}>
                                                {decoratedText}
                                            </SecureLink>
                                        )}
                                    >
                                        {message.text}{" "}
                                    </Linkify>
                                </span>

                            </>
                        ) }
                    </div>
                    <p className="w-full text-gray-400 min-w-[100px] p-2 text-xs absolute bottom-0 text-right right-0">
                        { message.timestamp != null && dateFormatter(message.timestamp.toDate(), DateFormatterOptions.TIME_ONLY) }
                    </p>

                    { reactionsDisplayShow && <ReactionStatus reactionsCounter={reactionsCounter} isSender={isSender}/> }
                </div>
            </div>
        </>
    );
}