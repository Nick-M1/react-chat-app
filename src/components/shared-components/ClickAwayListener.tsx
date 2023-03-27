import { useEffect, useRef } from "react";

type Props = {
    onClickAway: () => void;
    children: (ref: any) => any;
}

export default function ClickAwayListener({ children, onClickAway }: Props) {
    const childrenRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handler = (e: any) => {
            if (childrenRef.current && !childrenRef.current.contains(e.target)) {
                onClickAway();
            }
        };

        window.addEventListener("click", handler);

        return () => window.removeEventListener("click", handler);
    }, []);

    return <>{ children(childrenRef) }</>;
};