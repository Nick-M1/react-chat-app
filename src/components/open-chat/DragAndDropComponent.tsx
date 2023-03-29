import {Dispatch, SetStateAction, useEffect, useState} from "react";

type Props = {
    setFormValueFile: Dispatch<SetStateAction<string | File | null>>
}

export default function DragAndDropComponent({ setFormValueFile }: Props) {
    const [fileDragging, setFileDragging] = useState(false);

    useEffect(() => {
        const dragBlurHandler = (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setFileDragging(false);
        };

        const dragFocusHandler = (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setFileDragging(true);
        };

        const dropFileHandler = async (e: any) => {
            e.preventDefault();
            e.stopPropagation();

            setFileDragging(false);

            let items = e.dataTransfer.items;
            let files = e.dataTransfer.files;

            let selectedFiles = [];

            for (let i = 0, item; (item = items[i]); ++i) {
                let entry = item.webkitGetAsEntry();
                if (entry.isFile) {
                    selectedFiles.push(files[i]);
                }
            }

            for (let i = 0; i < selectedFiles.length; i++) {
                setFormValueFile(selectedFiles[i]);
            }
        };

        addEventListener("dragenter", dragFocusHandler);
        addEventListener("dragover", dragFocusHandler);
        addEventListener("dragleave", dragBlurHandler);
        addEventListener("drop", dropFileHandler);

        return () => {
            removeEventListener("dragenter", dragFocusHandler);
            removeEventListener("dragover", dragFocusHandler);
            removeEventListener("dragleave", dragBlurHandler);
            removeEventListener("drop", dropFileHandler);
        };
    }, []);

    return (
        fileDragging ? (
            <div className="pointer-events-none fixed top-0 left-0 z-30 flex h-full w-full select-none items-center justify-center backdrop-blur-sm">
                <h1 className="text-3xl">Drop file to send</h1>
            </div>
        ) : (
            <></>
        )
    )
};