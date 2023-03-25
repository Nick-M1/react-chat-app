import {Dialog, Menu, Transition } from "@headlessui/react";
import React, {Dispatch, Fragment, SetStateAction, useState} from "react";
import {User} from "firebase/auth";
import {EllipsisVerticalIcon, FaceSmileIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import Linkify from 'react-linkify';
import dateFormatter from "../../utils/time-formatter";
import {BsReplyFill} from "react-icons/bs";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {classNames} from "../../utils/textUtils";
import smoothScroll from "../../utils/smooth-scroll";


type Props = {
    message: Message
    messageItIsReplyingTo: Message | undefined

    setMessageToDelete: Dispatch<SetStateAction<string | null>>
    setReplyToMsgId: Dispatch<SetStateAction<string | null>>

    user: User
}

export default function MessageSingle({ message, messageItIsReplyingTo, setMessageToDelete, setReplyToMsgId, user }: Props) {
    const isSender = user?.uid == message.user.id

    const scrollToReplyOriginal = (otherMessageId: string) => {
        smoothScroll(otherMessageId, 'nearest')
    }

    return (
        <div className={`group flex w-full md:min-w-[80px] md:pr-3`} id={message.id}>
            <div className={`hidden group-hover:flex my-auto smooth-transition ${isSender ? 'ml-auto mr-3' : 'order-last'}`}>
                { !message.isDeleted && (
                    <>
                        { isSender && <TrashIcon
                            className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                            onClick={() => setMessageToDelete(message.id)}
                        />}
                        <BsReplyFill
                        className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                        onClick={() => setReplyToMsgId(message.id)}
                        />
                        <FaceSmileIcon
                        className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                        />
                    </>
                )}

            </div>
            <div
                style={{ width: "fit-content" }}
                className={
                    classNames(
                        'p-4 rounded-lg mx-3 my-2 min-w-[85px] max-w-[75dvw] md:max-w-[65dvw] min-h-[65px] pb-7 relative text-left break-all text-white',
                        isSender
                            ? "ml-auto group-hover:ml-0 bg-indigo-900 text-left"
                            : "bg-blue-900 text-left",
                )}
            >
                <div>
                    { message.isDeleted ? (
                        <span className='italic text-gray-300'>This message was deleted</span>
                    ) : (
                        <>
                        { message.replyToMsgId != null &&
                            <div onClick={() => scrollToReplyOriginal(message.replyToMsgId!)}
                                className='-mt-1 -mx-1 bg-neutral-700 opacity-90 min-w-[15dvw] max-h-[10dvh] overflow-x-clip overflow-y-clip scrollbar rounded-lg flex cursor-pointer'
                            >
                                <div className='h-full w-1 bg-blue-500 rounded-lg mr-3 flex-shrink-0'/>
                                <div className='p-1 italic text-gray-300 text-sm line-clamp-3'>
                                    <span className='text-blue-500'>{ messageItIsReplyingTo?.user.displayname }</span>
                                    <br/>
                                    { messageItIsReplyingTo?.text }
                                </div>
                            </div>
                        }

                        <Linkify>
                            {message.text}{" "}
                        </Linkify>
                        </>
                    ) }
                </div>
                <p className="text-gray-400 min-w-[80px] p-2 text-xs absolute bottom-0 text-right right-0 mt-3">
                    { message.timestamp != null && dateFormatter(message.timestamp.toDate()) }
                </p>
            </div>
        </div>
    );
}