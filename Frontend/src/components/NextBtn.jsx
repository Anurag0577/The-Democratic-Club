import usePlaySong from "../hooks/usePlaySong.js"
import { FaStepForward } from 'react-icons/fa';

export function NextBtn() {
    const handlePlaySong = usePlaySong();
    return (
        <>
            <div className="flex justify-start pl-4 md:pl-8">
                <button
                    className="text-white/60 hover:text-white text-base md:text-2xl transition-colors duration-200 cursor-pointer"
                    title="Next"
                    onClick={handlePlaySong}
                >
                    <FaStepForward />
                </button>
            </div>
        </>
    )
}