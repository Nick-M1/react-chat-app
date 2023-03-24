import {Dialog, Menu, Transition } from "@headlessui/react";
import {Dispatch, Fragment, SetStateAction, useState} from "react";
import {User} from "firebase/auth";
import {EllipsisVerticalIcon, FaceSmileIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import Linkify from 'react-linkify';
import dateFormatter from "../../utils/time-formatter";
import {BsReplyFill} from "react-icons/bs";


type Props = {
    message: Message
    setMessageToDelete: Dispatch<SetStateAction<string | null>>

    user: User
}

export default function MessageSingle({ message, setMessageToDelete, user }: Props) {
    const isSender = user?.uid == message.user.id

    return (
        <div className={`group flex w-full md:min-w-[80px] md:pr-3`} id={message.id}>
            <div className={`hidden group-hover:flex my-auto smooth-transition ${isSender ? 'ml-auto mr-3' : 'order-last'}`}>
                {isSender && !message.isDeleted && <TrashIcon
                    className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                    onClick={() => setMessageToDelete(message.id)}
                />}
                <BsReplyFill
                    className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                />
                <FaceSmileIcon
                    className="w-5 h-5 m-1 cursor-pointer focus:outline-none opacity-70 hover:opacity-100 smooth-transition"
                />
            </div>

            <div
                style={{ width: "fit-content" }}
                className={`p-4 rounded-lg mx-3 my-2 min-w-[85px] min-h-[65px] pb-7 relative text-center break-all text-white ${
                        isSender
                        ? "ml-auto group-hover:ml-0 bg-indigo-900 text-left"
                        : "bg-blue-900 text-left"
                }`}
            >
                <div>
                    { message.isDeleted ? (
                        <span className='italic text-gray-300'>This message was deleted</span>
                    ) : (
                        <Linkify>
                            {message.text}{" "}
                        </Linkify>
                    ) }
                </div>
                <p className="text-gray-400 min-w-[80px] p-2 text-xs absolute bottom-0 text-right right-0 mt-3">
                    { message.timestamp != null && dateFormatter(message.timestamp.toDate()) }
                </p>
            </div>
        </div>
    );
}