import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore.js';
import useAuthStore from '../store/useAuthStore.js';
import { useRoomStore } from '../store/useRoomStore.js';
import usePlaySong from './usePlaySong.js';

const END_BUFFER_MS = 500;

export function useAutoAdvance() {
  const spotifyPlayer = usePlayerStore(state => state.spotifyPlayer);
  const currentSong = usePlayerStore(state => state.currentSong);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const playerStateChanged = usePlayerStore(state => state.playerStateChanged);

  const user = useAuthStore(state => state.user);
  const createdBy = useRoomStore(state => state.room?.createdBy);
  const isHost = Boolean(user?.id && createdBy?._id === user.id);

  const handlePlaySong = usePlaySong();

  const handlePlaySongRef = useRef(handlePlaySong);
  useEffect(() => {
    handlePlaySongRef.current = handlePlaySong;
  });

  const hasAdvancedForTrackRef = useRef(null);
  const prevSdkStateRef = useRef(null);
  const trackKey = currentSong?._id ?? currentSong?.spotifyUri ?? null;

  useEffect(() => {
    hasAdvancedForTrackRef.current = null;
    prevSdkStateRef.current = null;
  }, [trackKey]);

  function triggerAdvanceOnce(reason) {
    if (!trackKey) return;
    if (hasAdvancedForTrackRef.current === trackKey) return;

    hasAdvancedForTrackRef.current = trackKey;
    console.log(`[useAutoAdvance] Advancing queue (${reason})`);
    handlePlaySongRef.current();
  }

  useEffect(() => {
    if (!isHost || !spotifyPlayer) return;

    function handleStateChange(state) {
      if (!state) return;
      const prev = prevSdkStateRef.current;

      const trackEnded =
        prev &&
        !prev.paused &&
        state.paused &&
        state.position === 0 &&
        state.track_window?.previous_tracks?.length >
          (prev.track_window?.previous_tracks?.length ?? 0);

      prevSdkStateRef.current = state;

      if (trackEnded) {
        triggerAdvanceOnce('sdk event');
      }
    }

    spotifyPlayer.addListener('player_state_changed', handleStateChange);
    return () => spotifyPlayer.removeListener('player_state_changed', handleStateChange);
  }, [isHost, spotifyPlayer]);


  useEffect(() => {
    if (!isHost || !isPlaying) return;

    const { duration, position, receivedAt } = playerStateChanged || {};
    if (!duration) return;

    const elapsedSinceAnchor = receivedAt ? Date.now() - receivedAt : 0;
    const estimatedCurrentPosition = position + elapsedSinceAnchor;
    const remainingMs = duration - estimatedCurrentPosition - END_BUFFER_MS;

    if (remainingMs <= 0) return;

    const timeoutId = setTimeout(() => {
      triggerAdvanceOnce('calculated timeout');
    }, remainingMs);

    return () => clearTimeout(timeoutId);

  }, [isHost, isPlaying, playerStateChanged, trackKey]);
}