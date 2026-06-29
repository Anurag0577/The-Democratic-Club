import { useParams } from "react-router"

export function Room(){

    const {roomCode} = useParams()

    return(
        <>
            <h1 className="text-5xl bold bg-black text-white">Hello, Welcome to room: {roomCode}</h1>
        </>
    )
}