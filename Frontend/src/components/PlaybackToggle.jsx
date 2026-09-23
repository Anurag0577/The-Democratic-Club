import {FaPlay,FaPause} from 'react-icons/fa';
import { usePlayerStore } from "../store/usePlayerStore.js"
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.js"
import { toast } from 'sonner';

export function PlaybackToggle() {
    // hook
    const { spotifyPlayer } = useSpotifyPlayer();

    // zustand store actions and stats
    const isPlaying = usePlayerStore(state => state.isPlaying);

    const handleTogglePlay = () => {
        if (!spotifyPlayer) {
            toast.message('Toggle does not work. Error: There is no player instance!')
            console.log('Toggle does not work. Error: There is no player instance!')
            return
        }
        spotifyPlayer.togglePlay().then(() => {
            console.log(`IsPlaying value is ${isPlaying}, changing it to ${!isPlaying}`);
            usePlayerStore.setState({ isPlaying: !isPlaying })
        });

    }

    return (
        <>

            <div className="flex justify-center">
                <button
                    onClick={handleTogglePlay}
                    className="bg-white hover:bg-white text-black rounded-full p-3 md:p-4 text-lg md:text-2xl transition-colors duration-200 shadow-lg cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                </button>
            </div>
        </>
    );
}