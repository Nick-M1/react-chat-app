import {Combobox, Listbox, Menu, Transition} from "@headlessui/react";
import React, {Dispatch, FormEvent, Fragment, SetStateAction, useEffect, useState} from "react";
import {CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {classNames} from "../../utils/textUtils";


type Props = {
    selectedUsers: UserType[]
    setSelectedUsers: Dispatch<SetStateAction<UserType[]>>

    newChatFormvalue: string
    setNewChatFormvalue: Dispatch<SetStateAction<string>>

    newChatAutocomplete: UserType[]
}

export default function AutocompleteSelector({ selectedUsers, setSelectedUsers, newChatFormvalue, setNewChatFormvalue, newChatAutocomplete }: Props) {
    return (
        <div className='relative border-none cursor-pointer w-full'>
            <Combobox value={selectedUsers} onChange={(users) => setSelectedUsers(users)} multiple>

                <div className="group relative flex items-center w-full h-12 rounded-lg border border-gray-600 hover:border-gray-400 focus-within:ring-1 focus-within:ring-blue-400 backdrop-blur-lg overflow-hidden smooth-transition">
                    <Combobox.Input
                        value={newChatFormvalue}
                        onChange={(event) => setNewChatFormvalue(event.target.value)}
                        placeholder='Search for someone'
                        className='peer h-full w-full p-4 outline-none border-none bg-white/10 backdrop-blur-lg text-gray-200 placeholder:text-gray-300 md:pr-2 bg-none focus:outline-none focus:ring-0 smooth-transition' />

                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </Combobox.Button>
                </div>

                <Transition
                    show={true}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >

                    <Combobox.Options static className='absolute z-10 w-full rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        { newChatAutocomplete.map((currUser) => (
                            <Combobox.Option key={currUser.id} value={currUser}>
                                {({ active, selected  }) => (
                                    <div className={`rounded-lg backdrop-blur-lg smooth-transition hover:bg-gray-100 ${selected && 'bg-gray-200 hover:bg-gray-300'}`}>
                                        <div className="flex items-center p-4 my-1 text-black dark:text-white break-words cursor-pointer rounded-xl">
                                            <img
                                                width={30}
                                                height={30}
                                                src={currUser.image}
                                                alt={currUser.displayname}
                                                className="rounded-full cursor-pointer hover:opacity-80"
                                            />
                                            <div className="flex flex-col ml-3 break-words cursor-pointer">
                                                <p>{currUser.displayname}</p>
                                            </div>

                                            { selected && <CheckIcon className="h-5 w-5 ml-auto" aria-hidden="true" /> }
                                        </div>
                                    </div>

                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </Combobox>
        </div>
    )
}