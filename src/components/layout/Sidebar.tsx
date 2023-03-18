import {Dialog, Transition} from "@headlessui/react";
import {Dispatch, Fragment, SetStateAction, useEffect, useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {User} from "firebase/auth";
import SignoutButton from "../authentication/SignoutButton";
import {arrayUnion, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where} from "firebase/firestore";
import {db} from "../../firebase";
import ChatroomSingle from "./ChatroomSingle";
import {v4 as uuidv4} from "uuid";
import AutocompleteSelector from "./AutocompleteSelector";

type Props = {
    user: User
    setSelectedChatroomId: Dispatch<SetStateAction<string>>
}

export default function Sidebar({ user, setSelectedChatroomId }: Props) {
    const [newChatFormvalue, setNewChatFormvalue] = useState('')
    const [newChatAutocomplete, setNewChatAutocomplete] = useState<UserType[]>([])
    useEffect(() => {
        if (newChatFormvalue.length > 3) {
            getDocs(
                query(
                    collection(db, 'users'),
                    where('email', '>=', newChatFormvalue),
                    where('email', '<=', newChatFormvalue + '\uf8ff'),
                    where('email', '!=', user.email)
                )
            ).then(r => setNewChatAutocomplete(r.docs.map(d => d.data() as UserType)))

        } else
            setNewChatAutocomplete( selectedUsers)
    }, [newChatFormvalue])

    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
    const [newChatPopup, setNewChatPopup] = useState(false)
    const openNewChatPopup = () => setNewChatPopup(true)
    const closeNewChatPopup = () => {
        setSelectedUsers([])
        setNewChatPopup(false)
    }


    const [allChatrooms, setAllChatrooms] = useState<ChatRoom[]>([])
    const chatroomUnsub = onSnapshot(
        query(
            collection(db, "rooms"),
            where('userIds', 'array-contains', user?.uid)
        ),
        (docs) => {
            setAllChatrooms(docs.docs.map(d => d.data() as ChatRoom))
        });
    useEffect(() => { return () => chatroomUnsub() }, [])



    const newChatHandler = async () => {
        const newRoomId = uuidv4()

        const roomsRef = doc(db, "rooms", newRoomId)
        await setDoc(roomsRef, {
            id: newRoomId,
            userIds: [...selectedUsers.map(u => u.id), user.uid],
            users: [ ...selectedUsers, {
                id: user.uid,
                displayname: user.displayName,
                email: user.email,
                image: user.photoURL
            } as UserType ]
        } as ChatRoom);

        setSelectedChatroomId(newRoomId)
    }

    return (
        <div className="flex w-[30vw]">
            <div className="max-h-screen bg-blue-400 dark:bg-white/[8%] backdrop-blur-lg w-[400px] min-h-screen text-black dark:text-white">
                <SignoutButton/>

                <div className="pt-5 text-center ">
                    <img
                        src={ user && user.photoURL != null ? user.photoURL : "/unknown-profilepic.png" }
                        alt="chatCube"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </div>
                <div className="flex items-center justify-center p-3 border-b-[1px] border-indigo-900">
                    <div className="flex items-center justify-center p-3 text-black bg-white/10 backdrop-filter backdrop-blur-2xl rounded-xl w-80">
                        <MagnifyingGlassIcon className="w-6 h-6 dark:text-white  text-black" />
                        <input
                            // ref={inputFocusRef}
                            className="flex-1 ml-3 text-black placeholder-black  dark:text-white dark:placeholder-white bg-transparent border-none outline-none"
                            placeholder="Search in chats"
                            type="text"
                            // onChange={filterChats}
                        />
                    </div>
                </div>
                <hr className="text-transparent bg-transparent" />

                <div>
                    <div className="px-3 pt-5">
                        <p className="pb-5 text-sm font-medium tracking-widest uppercase">
                            direct messages
                        </p>
                    </div>
                    <div className="w-full max-h-[48vh] overflow-y-scroll hidescrollbar">
                        {allChatrooms.map((chat) => (
                            <ChatroomSingle key={chat.id} chatroom={chat} setSelectedChatroomId={setSelectedChatroomId} />
                        ))}
                    </div>
                </div>

                <div className="flex fixed w-[400px] bottom-0 flex-col justify-between mt-auto">
                    <div className="w-full focus:outline-none py-2 px-8">
                        <button
                            className="bg-blue-700 text-white shadow-lg p-2 text-center font-semibold rounded-sm w-full"
                            onClick={openNewChatPopup}
                        >
                            Start a new chat
                        </button>
                    </div>
                    <div className="p-4 border-t-[1px] border-indigo-900 flex pl-6 flex-row items-center">
                        {/*<SignedIn>*/}
                        {/*    <UserButton />*/}
                        {/*</SignedIn>*/}
                        {/*<h1 className="ml-4 font-semibold">{user?.fullName}</h1>*/}
                    </div>
                </div>
            </div>

            {/* Create new chat popup */}
            <Transition appear show={newChatPopup} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
                    onClose={closeNewChatPopup}
                >
                    <div className="min-h-screen px-4 text-center">
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
                            <div className="inline-block w-full max-w-xl py-6 px-8 my-8 text-left align-middle transition-all transform bg-blue-700 shadow-xl rounded-xl">
                                <Dialog.Title
                                    as="h3"
                                    className="pb-3 text-lg font-semibold leading-6 text-black dark:text-white"
                                >
                                    Start a chat with others
                                </Dialog.Title>

                                <div className='flex space-x-4'>
                                    <AutocompleteSelector
                                        selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
                                        newChatFormvalue={newChatFormvalue} setNewChatFormvalue={setNewChatFormvalue}
                                        newChatAutocomplete={newChatAutocomplete}
                                    />

                                    <div className="">
                                        <button
                                            type="button"
                                            className="inline-flex min-w-[135px] justify-center py-3 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-xl hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                            onClick={() => {
                                                newChatHandler()
                                                closeNewChatPopup()
                                            }}
                                        >
                                            Start new chat!
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}