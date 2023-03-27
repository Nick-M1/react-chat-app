import {REACTIONS} from "../../utils/reactions";


type Props = {
    reactionsCounter: number[]
    isSender: boolean
}

export default function ReactionStatus({ reactionsCounter, isSender }: Props) {
    return (
        <div className={`w-fit pl-1.5 mr-3 py-0.5 -my-1 rounded-full z[1] flex translate-y-1.5 ${isSender ? 'bg-neutral-700' : 'bg-neutral-800/50'}`}>
            { REACTIONS.map(({name, icon}, index) => (
                <div key={name} className={`flex ${reactionsCounter[index] == 0 && 'hidden'}`}>
                    <img
                        title={name}
                        className={`h-4 w-4 transition duration-300 hover:scale-[115%]`}
                        src={icon}
                        alt=""
                    />
                    <span className='-mt-0.5 ml-0.5 mr-2 text-sm'>{ reactionsCounter[index] }</span>
                </div>
            ))}
        </div>
    );
}