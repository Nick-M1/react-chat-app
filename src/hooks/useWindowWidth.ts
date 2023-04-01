import {useEffect, useState} from "react";

type WindowSizeType = {
    width: number
    height: number
}

export default function useWindowSize(): WindowSizeType {
    const [windowSize, setWindowSize] = useState<WindowSizeType>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}