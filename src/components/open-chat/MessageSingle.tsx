import {Dialog, Menu, Transition } from "@headlessui/react";
import {Fragment, useState} from "react";
import {User} from "firebase/auth";
import {EllipsisVerticalIcon, PencilIcon, TrashIcon} from "@heroicons/react/24/outline";
import Linkify from 'react-linkify';


type Props = {
    message: Message
    user: User
}

export default function MessageSingle({ message, user }: Props) {
    const isSender = user?.uid == message.userId

    const [modal, setModal] = useState(false)
    const openModal = () => setModal(true)
    const closeModal = () => setModal(false)

    return (
        <div className="min-w-[80px]">
            <div
                style={{ width: "fit-content" }}
                className={`p-4 rounded-lg m-3 min-w-[80px] pb-7 relative text-center break-all text-white ${
                        isSender
                        ? "ml-auto bg-indigo-900 text-left"
                        : "bg-blue-900 text-left"
                }`}
            >
                <div>
                    <Linkify>
                        {message.text}{" "}
                        {/*<span className="text-sm text-gray-400">*/}
                        {/*    {message.edited && "(edited)"}*/}
                        {/*</span>*/}
                    </Linkify>
                    { isSender && (
                        <Menu>
                            <Menu.Button>
                                <EllipsisVerticalIcon className="w-4 h-4 cursor-pointer" />
                            </Menu.Button>
                            <Menu.Items className="flex">
                                <Menu.Item>
                                    {({ active }) => (
                                        <PencilIcon
                                            className="w-5 h-5 m-1 cursor-pointer focus:outline-none"
                                            onClick={openModal}
                                        />
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <TrashIcon
                                            className="w-5 h-5 m-1 cursor-pointer focus:outline-none"
                                            // onClick={deleteMessage}
                                        />
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    )}
                </div>
                <p className="text-gray-400 min-w-[80px] p-2 text-xs absolute bottom-0 text-right right-0 mt-3">
                    { message.createdAt }
                </p>
            </div>
            <Transition appear show={modal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeModal}
                >
                    <div className="min-h-screen px-4 text-center backdrop-blur-sm">
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
                            className="inline-block h-screen align-middle"
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
                        cursor-pointer
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}