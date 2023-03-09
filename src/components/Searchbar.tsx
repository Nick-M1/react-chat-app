import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import React, {Dispatch, FormEvent, SetStateAction, useState} from 'react';

type Props = {
    sortingTextsearch: string
    setSortingTextsearch: Dispatch<SetStateAction<string>>
}

export default function Searchbar({ sortingTextsearch, setSortingTextsearch }: Props) {

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setSortingTextsearch("");
    };

    return (
        <div className='border-none cursor-pointer w-full'>
            <form onSubmit={handleSearch} className="group relative flex w-full h-12 rounded-lg bg-white shadow-sm border border-gray-200 hover:border-gray-400 focus-within:ring-1 focus-within:ring-indigo-600 overflow-hidden smooth-transition">
                <div className="grid place-items-center h-full w-5 md:w-12 text-gray-300 border-none">
                    <button type="submit" >
                        <MagnifyingGlassIcon className="pointer-events-non h-5 w-5 pl-1 md:pl-0 md:h-6 md:w-6 border-none group-hover:text-gray-500 smooth-transition" aria-hidden="true" />
                    </button>
                </div>
                <input
                    className="peer h-full w-full outline-none border-none text-sm text-gray-700 md:pr-2 bg-none focus:outline-none focus:ring-0 smooth-transition"
                    type="text"
                    id="search"
                    placeholder="Search..."
                    value={sortingTextsearch}
                    onChange={(e) => setSortingTextsearch(e.target.value)}
                />
            </form>
        </div>
    );
}