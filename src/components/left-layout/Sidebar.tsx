import {Dialog, Transition} from "@headlessui/react";
import {Dispatch, Fragment, SetStateAction, useEffect, useState} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {User} from "firebase/auth";
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    or,
    orderBy
} from "firebase/firestore";
import {db} from "../../firebase";
import ChatroomSingle from "./ChatroomSingle";
import {v4 as uuidv4} from "uuid";
import AutocompleteSelector from "./AutocompleteSelector";
import UserprofileDropdown from "./UserprofileDropdown";
import {toastOptionsCustom} from "../../utils/toast-options-custom";
import toast from "react-hot-toast";
import {useStoreChatrooms} from "../../store";
import {shallow} from "zustand/shallow";

function checkNewChatTitle(newChatTitleLength: number) {
    return newChatTitleLength < 3 || newChatTitleLength > 20
}

type Props = {
    user: User
    selectedChatroom: ChatRoom | null
    setSelectedChatroom: Dispatch<SetStateAction<ChatRoom | null>>

    allChatrooms: ChatRoom[]
    setAllChatrooms: Dispatch<SetStateAction<ChatRoom[]>>
}

export default function Sidebar({ user, selectedChatroom, setSelectedChatroom, allChatrooms, setAllChatrooms }: Props) {

    // FILTER FOR CHATS
    const [chatSearchFilter, setChatSearchFilter] = useState('')
    useEffect(() => {
        const chatroomUnsub = onSnapshot(
            query(
                collection(db, "rooms"),
                where('userIds', 'array-contains', user?.uid),
                where('name_lowercase', '>=', chatSearchFilter.toLowerCase()),
                where('name_lowercase', '<=', chatSearchFilter.toLowerCase() + '\uf8ff'),
            ),
            (docs) => {
                setAllChatrooms(
                    docs.docs.map(d => d.data() as ChatRoom)
                        .sort((chat1, chat2) => chat2.timestamp - chat1.timestamp))
            });

        return () => chatroomUnsub()
    }, [chatSearchFilter, user])

    const [chatroomsStore, addNewChatroomStore] = useStoreChatrooms((state) => [state.chatrooms, state.addNewChatroom], shallow )
    useEffect(() => {
        allChatrooms
            .map(c => c.id)
            .forEach(cId => {
                if (!chatroomsStore.hasOwnProperty(cId))
                    addNewChatroomStore(cId)
            })
    }, [allChatrooms])


    // FOR NEW CHAT POPUP
    const [newChatFormvalue, setNewChatFormvalue] = useState('')
    const [newChatAutocomplete, setNewChatAutocomplete] = useState<UserType[]>([])
    useEffect(() => {
        if (newChatFormvalue.length > 3) {
            getDocs(
                query(
                    collection(db, 'users'),
                    where('email', '>=', newChatFormvalue),
                    where('email', '<=', newChatFormvalue + '\uf8ff'),
                    where('email', '!=', user.email),
                )
            ).then(r => setNewChatAutocomplete(r.docs.map(d => d.data() as UserType)))

        } else
            setNewChatAutocomplete( selectedUsers)
    }, [newChatFormvalue])

    // new chat form values
    const [newChatFormInvalid, setNewChatFormInvalid] = useState(false)
    const [newChatTitle, setNewChatTitle] = useState('')
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])

    // popup's state
    const [newChatPopup, setNewChatPopup] = useState(false)
    const openNewChatPopup = () => setNewChatPopup(true)
    const closeNewChatPopup = () => {
        setSelectedUsers([])
        setNewChatTitle('')
        setNewChatFormInvalid(false)
        setNewChatPopup(false)
    }

    const newChatHandler = async () => {
        toast.loading('Creating new chatroom...', { ...toastOptionsCustom, id: 'new-chatroom' } )

        if (checkNewChatTitle(newChatTitle.length)) {
            setNewChatFormInvalid(true)
            toast.error('Input error: Title must have between 3 and 21 characters', { id: 'new-chatroom' })
            return
        }
        if (selectedUsers.length == 0) {
            setNewChatFormInvalid(true)
            toast.error('Input error: Must invite at least 1 other person to the chat', { id: 'new-chatroom' })
            return
        }


        const newRoomId = uuidv4()
        const newChatroom: ChatRoom = {
            id: newRoomId,
            timestamp: serverTimestamp(),
            name: newChatTitle,
            name_lowercase: newChatTitle.toLowerCase(),

            userIds: [...selectedUsers.map(u => u.id), user.uid],
            users: [ ...selectedUsers, {
                id: user.uid,
                displayname: user.displayName,
                email: user.email,
                image: user.photoURL
            } as UserType ]
        };

        const roomsRef = doc(db, "rooms", newRoomId)
        await setDoc(roomsRef, newChatroom);

        toast.success('Chat created successfully', { id: 'new-chatroom' })
        setSelectedChatroom(newChatroom)
        closeNewChatPopup()
    }

    return (
        <div className="flex w-full h-full md:w-[20vw]">
            <div className=" backdrop-blur-lg w-full md:w-[400px] border-r border-gray-700">
                <div className="pt-5 pb-6 text-center align-middle px-6 flex border-b border-gray-700">
                    <img
                        src="/brand-logo.svg"
                        alt="chatCube"
                        width={35}
                        height={35}
                        className=""
                    />
                    <h1 className='ml-3 mt-1 font-bold text-xl'>Chat App</h1>

                    <UserprofileDropdown user={user}/>
                </div>

                <div>
                    <div className="px-3 pt-5 ">
                        <p className="text-sm font-medium tracking-widest">
                            DIRECT MESSAGES
                        </p>
                    </div>

                    <div className="flex items-center justify-center px-3 pb-4 pt-2 ">
                        <div className="flex w-full items-center justify-center p-3 text-black bg-white/10 backdrop-filter backdrop-blur-2xl rounded-xl hover:ring-2 hover:ring-gray-600 smooth-transition">
                            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
                            <input
                                className="flex-1 ml-3 text-white placeholder-gray-400 bg-transparent border-none outline-none"
                                placeholder="Search in chats"
                                type="text"
                                value={chatSearchFilter}
                                onChange={(e) => setChatSearchFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full max-h-[65dvh] lg:max-h-[65vh] overflow-y-scroll scrollbar smooth-transition">
                        { allChatrooms.map((chat) => (
                            <ChatroomSingle
                                key={chat.id}
                                chatroom={chat}
                                storeTimestamp={chatroomsStore[chat.id]}
                                selectedChatroom={selectedChatroom}
                                setSelectedChatroom={setSelectedChatroom}
                            />
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 w-full bg-neutral-800 border-t-2 border-gray-700 focus:outline-none py-2 px-8">
                    <button
                        className=" w-full btn-primary "
                        onClick={openNewChatPopup}
                    >
                        Start a new chat
                    </button>
                </div>
            </div>

            {/* Create new chat popup */}
            <Transition appear show={newChatPopup} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
                    onClose={closeNewChatPopup}
                >
                    <div className="min-h-screen-withmobile px-4 text-center">
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
                            <div className="inline-block w-full max-w-xl py-6 px-8 my-8 text-left align-middle transition-all transform bg-neutral-800 border border-neutral-700 shadow-xl rounded-xl">
                                <Dialog.Title
                                    as="h3"
                                    className="pb-3 text-2xl leading-6 text-white border-b border-gray-700 text-center"
                                >
                                    Start a new chat
                                    <div onClick={() => closeNewChatPopup()} className='absolute p-1 right-6 top-5 bg-neutral-700/75 hover:bg-neutral-700 active:bg-neutral-600/95 rounded-full cursor-pointer smooth-transition'>
                                        <XMarkIcon className='w-6 w-6'/>
                                    </div>
                                </Dialog.Title>

                                <div className='pt-3 pb-6'>
                                    <h1 className='text-lg leading-6 font-medium text-gray-300'>
                                        Chat Title
                                    </h1>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className={`block input-primary ${newChatFormInvalid && checkNewChatTitle(newChatTitle.length) && 'input-primary-invalid' }`}
                                        placeholder="Write a title for your recipe..."
                                        defaultValue={newChatTitle}
                                        onChange={(e) => setNewChatTitle(e.target.value)}
                                    />
                                    <p className={newChatFormInvalid && checkNewChatTitle(newChatTitle.length) ? 'text-red-600 text-sm tracking-wide italic mt-0.5' : 'hidden'}>Title must have between 3 and 21 characters</p>
                                </div>

                                <div>
                                    <h1 className='text-lg leading-6 font-medium text-gray-300 mb-1'>
                                        Select Contacts
                                    </h1>
                                    <div className='flex space-x-4'>
                                        <AutocompleteSelector
                                            selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
                                            newChatFormvalue={newChatFormvalue} setNewChatFormvalue={setNewChatFormvalue}
                                            newChatAutocomplete={newChatAutocomplete}
                                            newChatFormInvalid={newChatFormInvalid}
                                        />
                                        {/* todo: put input css into index.css */}
                                        <div className="mt-0.5">
                                            <button
                                                type="button"
                                                className="inline-flex min-w-[135px] btn-secondary"
                                                onClick={() => newChatHandler()}
                                            >
                                                Start new chat!
                                            </button>
                                        </div>
                                    </div>
                                    <p className={newChatFormInvalid && selectedUsers.length == 0 ? 'text-red-600 text-sm tracking-wide italic mt-1' : 'hidden'}>Must add at least 1 other person to the chat</p>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}