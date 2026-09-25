import { useState, useEffect, useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

export default function usePlaybackStarted() {

    // zustand state and actions
    const currentSong = usePlayerStore(state => state.currentSong)
    const spotifyPlayer = usePlayerStore(state => state.spotifyPlayer)

    //  ref hook variable
    // const isPlaybackStartedRef = useRef(false);
    const playingTrackIdRef = useRef(null);
    const [isPlaybackStarted, setIsPlaybackStarted] = useState(false)

    useEffect(() => {
        
        setIsPlaybackStarted(false);

        if (!spotifyPlayer || !currentSong) return;

        const handleStateChanged = (state) => {
            if(!state) return;
            if (currentSong.track_id !== playingTrackIdRef.current && state.paused === false) {

                playingTrackIdRef.current = currentSong.track_id;
                setIsPlaybackStarted(true);
            }
        }

        spotifyPlayer.addListener('player_state_changed', handleStateChanged)

        return () => spotifyPlayer.removeListener('player_state_changed', handleStateChanged)
    }, [currentSong, spotifyPlayer])

    return isPlaybackStarted;
}