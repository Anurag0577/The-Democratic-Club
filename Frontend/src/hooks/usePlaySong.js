import { useWebSocketStore } from "../store/useWebSocketStore.js";
import { usePlayerStore } from '../store/usePlayerStore.js';
import { toast } from 'sonner';

export default function usePlaySong() {

    const setCurrentSong = usePlayerStore(state => state.setCurrentSong)
    const spotifyPlayer = usePlayerStore(state => state.spotifyPlayer)
    const queue = useWebSocketStore(state => state.roomState.queue)
    const roomCode = useWebSocketStore(state => state.roomState.roomCode)
    const removeSong = useWebSocketStore(state => state.removeSong)
    const songChanged = useWebSocketStore(state => state.songChanged)
    const currentRoomId = useWebSocketStore(state => state.currentRoomId)

    const handlePlaySong = async () => {
        if (!queue.length) {
            toast.message("The Queue is empty! Please add song first.")
            return
        }
        if (spotifyPlayer) {
            try {
                await spotifyPlayer.activateElement();
                await spotifyPlayer.setVolume(0.8);
            } catch (err) {
                console.error('activateElement/setVolume failed:', err);
            }
        }
        const nextSong = queue[0];
        setCurrentSong(nextSong)
        usePlayerStore.setState({ isPlaying: true });

        // now we have to tell everyone that the song have been changed
        // remove the song from the queue and update the queue to other members
        songChanged(nextSong, roomCode)
        useWebSocketStore.setState((state) => ({
            roomState: {
                ...state.roomState,
                queue: state.roomState.queue.slice(1),
            },
        }));

        removeSong(nextSong, roomCode, currentRoomId)

    }

    return handlePlaySong;
}