import {Listbox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon, XMarkIcon} from '@heroicons/react/20/solid'
import {Dispatch, Fragment, SetStateAction, useState} from "react";
import {classNames} from "../../utils/textUtils";
import subjectToColour from "../../utils/subject-to-colour";

type Props = {
    allPossibleLabels: string[]

    selectedLabels: string[]
    setSelectedLabels: Dispatch<SetStateAction<string[]>>
}

export default function SubjectSelector({ allPossibleLabels, selectedLabels, setSelectedLabels }: Props) {

    return (
        <div className="">
            <div className="space-y-1">
                <Listbox value={selectedLabels} onChange={setSelectedLabels} name="labels" multiple>
                    <div className="relative z-10">
                        <span className="inline-block w-full rounded-md">
                            <Listbox.Button
                                className='relative w-full cursor-default py-2.5 pl-2 pr-10 text-left text-sm leading-5 smooth-transition input-primary bg-white'>
                                <span className="block flex flex-wrap gap-2 ">
                                    { selectedLabels.length === 0
                                        ? <span className='px-0.5 pl-1 text-base text-gray-500'>Empty</span>
                                        : ( selectedLabels.map((label) => (
                                            <span
                                                key={label}
                                                className={`flex items-center gap-1 rounded px-2.5 pl-2 py-0.5 capitalize ${subjectToColour(label)}`}
                                            >
                                                <span>{label}</span>
                                                <XMarkIcon
                                                    className="h-4 w-4 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        e.preventDefault()
                                                        setSelectedLabels((existing) => existing.filter((p) => p !== label))
                                                    }}
                                                />
                                            </span>
                                        ))
                                    )}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon
                                        className="h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                        </span>

                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >

                            <div className="absolute mt-1 w-full rounded-md bg-white">
                                <Listbox.Options
                                    className=" shadow-md drop-shadow-md scrollbar max-h-60 overflow-auto rounded-md py-1 text-base focus:outline-none text-sm leading-5">
                                    {allPossibleLabels.map((label) => (
                                        <Listbox.Option
                                            key={label}
                                            value={label}
                                            className={({active}) => {
                                                return classNames(
                                                    'relative cursor-pointer capitalize select-none py-2 pl-7 pr-4 focus:outline-none smooth-transition',
                                                    active ? 'bg-blue-400/40 text-blue-900' : 'text-gray-900'
                                                )
                                            }}
                                        >
                                            {({active, selected}) => (
                                                <>
                                              <span
                                                  className={classNames(
                                                      'block truncate',
                                                      selected ? 'font-semibold' : 'font-normal smooth-transition'
                                                  )}
                                              >
                                                {label}
                                              </span>
                                                    {selected && (
                                                        <span
                                                            className={classNames(
                                                                'absolute inset-y-0 right-0 flex items-center pr-3 smooth-transition',
                                                                active ? 'text-indigo-700' : 'text-indigo-400'
                                                            )}
                                                        >
                                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </div>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        </div>
    )
}