import usePlaySong from "../hooks/usePlaySong.js";
import { usePlayerStore } from "../store/usePlayerStore.js"
import { useWebSocketStore } from "../store/useWebSocketStore.js"
import { toast } from "sonner";

export default function StartPlayingSongBtn(){
    const handlePlaySong = usePlaySong();
    return (
        <>
            <button className='w-full md:w-auto py-2 md:px-10 cursor-pointer border rounded-4xl mt-5 hover:bg-white hover:text-black' onClick={handlePlaySong}>
                Start Playing Song
            </button>
        </>
    )
}