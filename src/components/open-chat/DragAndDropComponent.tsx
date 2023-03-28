import {Dispatch, SetStateAction, useState} from "react";

type Props = {
    setFormValueFile: Dispatch<SetStateAction<string | File | null>>
}

export default function DragAndDropComponent({ setFormValueFile }: Props) {
    const [dragActive, setDragActive] = useState(false);

    // Detect if dragging
    const handleDrag = function (event: React.DragEvent<HTMLFormElement | HTMLDivElement>) {
        event.preventDefault();
        event.stopPropagation();

        if (event.type === "dragover")
            setDragActive(true);
        else if (event.type === "dragleave")
            setDragActive(false);
    };

    // triggers when file is selected with click
    const handleChange = function(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.target.files && e.target.files[0].type.split('/')[0] == 'image')
            setFormValueFile(e.target.files[0])

        setDragActive(false)
    };



    return (
        <form onDragLeave={handleDrag} onDragOver={handleDrag} className={`hidden sm:block absolute inset-0 ${dragActive ? 'bg-neutral-800/70 z-30' : 'bg-none opacity-0'}`}>
            <input type="file" multiple={false} onChange={handleChange} className='w-full h-full opacity-0'/>
            <div className='absolute left-[10%] md:left-[40%] top-[40%] text-3xl'>
                🖼️ Drag and drop your file here
            </div>
        </form>
    );
};