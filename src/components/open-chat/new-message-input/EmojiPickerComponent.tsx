import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import React from "react";

type Props = {
    show: boolean
    className: string
    setState: (emojiData: {native: string}, event: MouseEvent) => void
}

export default function EmojiPicker({ show, className, setState }: Props) {
    return show ? (
        <div className={className}>
            <Picker
                data={emojiData}
                onEmojiSelect={setState}
                theme={'dark'} />
        </div>

    ): <></>
}