import {FaPlay,FaPause} from 'react-icons/fa';
import { usePlayerStore } from "../store/usePlayerStore.js"
import { useWebSocketStore } from "../store/useWebSocketStore.js"
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.js"
import { toast } from 'sonner';

export function PlaybackToggle() {
    const { spotifyPlayer } = useSpotifyPlayer();

    const isPlaying = usePlayerStore(state => state.isPlaying);
    const currentSong = usePlayerStore(state => state.currentSong);
    const updatePlaybackStatus = useWebSocketStore(state => state.updatePlaybackStatus);
    const roomCode = useWebSocketStore(state => state.roomState.roomCode);

    const handleTogglePlay = async () => {
        if (!spotifyPlayer) {
            toast.message('Toggle does not work. Error: There is no player instance!')
            return
        }

        try {
            // Snapshot position/duration BEFORE toggling — this is the last
            // reliably accurate read, since anything fetched right after
            // togglePlay() can race the SDK's internal state update.
            const stateBefore = await spotifyPlayer.getCurrentState();
            const position = stateBefore?.position ?? 0;
            const duration = stateBefore?.duration ?? 0;

            await spotifyPlayer.togglePlay();

            // togglePlay() unconditionally flips whatever it was — we already
            // know what it was (isPlaying, read before this call), so derive
            // the new paused state locally instead of re-querying the SDK.
            const paused = isPlaying;

            usePlayerStore.setState({ isPlaying: !paused });
            updatePlaybackStatus(duration, position, paused, roomCode, currentSong);
        } catch (err) {
            console.error('[PlaybackToggle] togglePlay failed:', err);
            toast.message('Failed to toggle playback.');
        }
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