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

    const [modal, setModal] = useState(false)
    const openModal = () => setModal(true)
    const closeModal = () => setModal(false)

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

            <Transition appear show={modal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen-withmobile px-4 text-center backdrop-blur-sm">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0" />
                        </Transition.Child>
                        <span
                            className="inline-block h-screen-withmobile align-middle"
                            aria-hidden="true"
                        >
                          &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-blue-800 shadow-xl rounded-xl">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-white"
                                >
                                    Edit your message
                                </Dialog.Title>
                                <form>
                                    <div className="mt-2">
                                        <input
                                            className="w-full p-5 text-white outline-none bg-white/10 rounded-xl backdrop-filter backdrop-blur-2xl bg-opacity-10 focus-visible:ring-blue-500"
                                            placeholder="Your edited message"
                                            // ref={editedMessage}
                                            // defaultValue={message.message}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            // onClick={editMessage}
                                        >
                                            Edit message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>{" "}
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}