import {useMemo} from "react";

export function UpVote(
    {
        direction = "up",
        filled = false,
        enabled = true,
        onClick = () => {},
    }: {
        direction: "up" | "down";
        filled?: boolean | null;
        enabled?: boolean;
        onClick?: () => void;
    } = {} as any
) {
    const classes = useMemo(()=> {
        const temp = [];
        if(direction==="down"){
            temp.push("origin-center rotate-180")
        }
        if(filled){
            temp.push(direction === "up" ? "fill-green-400" : "fill-red-400");
            temp.push("glow");
        } else {
            temp.push("fill-white");
        }
        if(!enabled){
            temp.push("opacity-50");
        }
        return temp.join(" ");
    }, [direction, filled, enabled]);
    return (
        <button
        disabled={!enabled}
        onClick={onClick}
        data-e2e={`${direction}vote`}
        data-filled={filled}
        >
            <p>+</p>
        </button>
    )
}