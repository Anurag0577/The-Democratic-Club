import {
  FaPlay,
  FaPause,
  FaRandom,
  FaStepBackward,
  FaStepForward,
} from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.js"
import api from '../api/axios.js';
import track_img from '../assets/Images/track_img.png'
import { useWebSocketStore } from '../store/useWebSocketStore.js';
import { PlaybackTimeline } from './PlaybackTimeline.jsx';
import useAuthStore from '../store/useAuthStore.js'
import { useRoomStore } from '../store/useRoomStore.js';
export default function PlayerSection() {

  const { player, deviceId, isReady } = useSpotifyPlayer();


  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);
  const setStoreDeviceId = usePlayerStore((state) => state.setDeviceId);
  const setIsSdkReady = usePlayerStore((state) => state.setIsSdkReady);
  const accentColor = useRoomStore((state) => state.accentColor);
  const setPlayerStateChangedLocal = usePlayerStore((state) => state.setPlayerStateChangedLocal)
  const songChanged = useWebSocketStore((state) => state.songChanged)
  const removeSong = useWebSocketStore((state)=> state.removeSong)
    const queue = useWebSocketStore((state) => state.roomState.queue) || [];
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const sdkPlayer = usePlayerStore((state) => state.sdkPlayer);
  const currentRoomId = useWebSocketStore((state) => state.currentRoomId)
  const user = useAuthStore((state) => state.user);
  const createdBy = useRoomStore((state) => state.room?.createdBy)

  console.log("||user||", user, "||createdBy||", createdBy)

  useEffect(() => {
    setIsSdkReady(isReady);
  }, [isReady, setIsSdkReady]);

  useEffect(() => {
    if (deviceId) {
      setStoreDeviceId(deviceId);
    }
  }, [deviceId, setStoreDeviceId]);

  // Keep a ref pointing at the LATEST currentSong. The player_state_changed
  // listener effect below only re-subscribes when `player`/`createdBy`/`user`
  // change — NOT when currentSong changes — so the listener closure would
  // otherwise see a stale currentSong. We need the live value to know which
  // track's state updates we should actually trust (see handleStateChange).
  const currentSongRef = useRef(currentSong);
  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  // Playback trust: the SDK lies about paused:true after REST /spotify/play transfers.
  // We track transfer window, position advancement, and explicit user pause instead.
  const playbackRef = useRef({
    transferStartedAt: null,
    lastPosition: null,
    userPaused: false,
  });
  const TRANSFER_GRACE_MS = 15000;
  const POSITION_ADVANCE_MS = 250;

  useEffect(() => {
    if (!currentSong) return;

    if (!isReady || !deviceId) {
      console.debug('[PlayerSection] Playback deferred: SDK not ready locally or missing live deviceId.', {
        isReady,
        deviceId,
      });
      return;
    }

    const spotifyUri = currentSong.spotifyUri;

    if (!spotifyUri) {
      console.warn('[PlayerSection] The selected song has no valid Spotify URI/track ID.', currentSong);
      return;
    }

    let isCancelled = false;

    async function pollUntilPlaying(expectedUri) {
      const playerInstance = usePlayerStore.getState().sdkPlayer;
      if (!playerInstance || !expectedUri) return;

      const deadline = Date.now() + TRANSFER_GRACE_MS;
      while (!isCancelled && Date.now() < deadline) {
        try {
          const liveState = await playerInstance.getCurrentState();
          const liveUri = liveState?.track_window?.current_track?.uri;
          if (liveState && liveUri === expectedUri && !liveState.paused) {
            playbackRef.current.lastPosition = liveState.position;
            setIsPlaying(true);
            setPlayerStateChangedLocal({
              duration: liveState.duration,
              position: liveState.position,
              paused: false,
            });
            console.debug('[PlayerSection] Transfer playback confirmed via getCurrentState');
            return;
          }
          if (liveState && liveUri === expectedUri && liveState.position > 0) {
            playbackRef.current.lastPosition = liveState.position;
            setIsPlaying(true);
            console.debug('[PlayerSection] Transfer playback inferred from advancing position');
            return;
          }
        } catch (err) {
          console.debug('[PlayerSection] getCurrentState poll failed:', err);
        }
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }

    async function startPlayback() {
      try {
        const resp = await api.put(
          '/spotify/play',
          { deviceId, spotifyUri },
          { withCredentials: true }
        );

        if (!isCancelled) {
          console.log('[PlayerSection] Playback request sent successfully:', resp?.status ?? 204);
          playbackRef.current = {
            transferStartedAt: Date.now(),
            lastPosition: null,
            userPaused: false,
          };
          setIsPlaying(true);
          pollUntilPlaying(spotifyUri);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('[PlayerSection] Failed to start playback:', err);
          playbackRef.current = { transferStartedAt: null, lastPosition: null, userPaused: false };
          setIsPlaying(false);
        }
      }
    }

    startPlayback();

    return () => {
      isCancelled = true;
    };
  }, [currentSong, isReady, deviceId, setIsPlaying, setPlayerStateChangedLocal]);

  async function handlePlaySong() {
    if (queue.length === 0) return;
    console.log("THIS IS QUEUE", queue)
    if (sdkPlayer) {
      try {
        console.log('[QueueSection] Unlocking browser audio via activateElement()...');
        await sdkPlayer.activateElement();
        await sdkPlayer.setVolume(0.8);
      } catch (err) {
        console.error('[QueueSection] activateElement or setVolume failed:', err);
      }
    } else {
      console.warn('[QueueSection] sdkPlayer instance is missing from usePlayerStore!');
    }

    console.log('[QueueSection] Active deviceId at click time:', deviceId);


    const nextTrack = queue[0];
    setCurrentSong(nextTrack);

    // now we have to tell the backend that the current song is changed
    songChanged(nextTrack, roomCode)

    useWebSocketStore.setState((state) => ({
      roomState: {
        ...state.roomState,
        queue: state.roomState.queue.slice(1),
      },
    }));

    // we have to send a REMOVE_SONG message to backend.
    removeSong(nextTrack, roomCode, currentRoomId)
  }

  // Keep a ref pointing at the LATEST handlePlaySong on every render.
  // The SDK listener effect below only re-subscribes when player/user/createdBy
  // change — NOT when queue changes — so calling handlePlaySong directly from
  // inside that effect would use a stale, possibly-empty queue. Calling through
  // this ref always reaches the current closure instead.
  const handlePlaySongRef = useRef(handlePlaySong);
  useEffect(() => {
    handlePlaySongRef.current = handlePlaySong;
  });

  // Ref to detect natural track-end vs manual pause
  const previousStateRef = useRef(null);

  function notePosition(position) {
    playbackRef.current.lastPosition = position;
  }

  function isPositionAdvancing(position) {
    const last = playbackRef.current.lastPosition;
    if (last === null) {
      notePosition(position);
      return false;
    }
    if (position > last + POSITION_ADVANCE_MS) {
      notePosition(position);
      return true;
    }
    notePosition(position);
    return false;
  }

  function isWithinTransferWindow() {
    const startedAt = playbackRef.current.transferStartedAt;
    return startedAt !== null && Date.now() - startedAt < TRANSFER_GRACE_MS;
  }

  // While audio plays the SDK can keep reporting paused:true. Poll position and
  // keep isPlaying true whenever the playhead is actually moving.
  useEffect(() => {
    if (!player || !currentSong) return;

    const interval = setInterval(async () => {
      if (playbackRef.current.userPaused) return;

      try {
        const liveState = await player.getCurrentState();
        const expectedUri = currentSongRef.current?.spotifyUri;
        const liveUri = liveState?.track_window?.current_track?.uri;
        if (!liveState || (expectedUri && liveUri !== expectedUri)) return;

        if (isPositionAdvancing(liveState.position)) {
          setIsPlaying(true);
          if (liveState.paused) {
            setPlayerStateChangedLocal({
              duration: liveState.duration,
              position: liveState.position,
              paused: false,
            });
          }
        } else if (!liveState.paused) {
          setIsPlaying(true);
        }
      } catch (err) {
        console.debug('[PlayerSection] playback sync poll failed:', err);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [player, currentSong, setIsPlaying, setPlayerStateChangedLocal]);

  useEffect(() => {
    if (!player) return;

    function applyPlayerState(state, paused) {
      setIsPlaying(!paused);

      setPlayerStateChangedLocal({
        duration: state.duration,
        position: state.position,
        paused,
      });

      const prev = previousStateRef.current;
      const isHost = createdBy?._id === user?.id;

      const trackEnded =
        isHost &&
        prev &&
        !prev.paused &&
        paused &&
        state.position === 0 &&
        state.track_window?.previous_tracks?.length > (prev.track_window?.previous_tracks?.length ?? 0);

      if (trackEnded) {
        console.log('[PlayerSection] Track ended naturally — advancing queue.');
        handlePlaySongRef.current();
      }

      previousStateRef.current = { ...state, paused };
    }

    function handleStateChange(state) {
      if (!state) return;

      const expectedUri = currentSongRef.current?.spotifyUri;
      const reportedUri = state.track_window?.current_track?.uri;

      if (expectedUri && reportedUri !== expectedUri) {
        console.debug(
          '[PlayerSection] Ignoring stale/mismatched player_state_changed',
          { expectedUri, reportedUri }
        );
        return;
      }

      const lastPosition = playbackRef.current.lastPosition;
      const positionAdvancing =
        lastPosition !== null &&
        state.position > lastPosition + POSITION_ADVANCE_MS;
      notePosition(state.position);

      const prev = previousStateRef.current;
      const isHost = createdBy?._id === user?.id;
      const trackEnded =
        isHost &&
        prev &&
        !prev.paused &&
        state.paused &&
        state.position === 0 &&
        state.track_window?.previous_tracks?.length > (prev.track_window?.previous_tracks?.length ?? 0);

      if (trackEnded) {
        playbackRef.current.userPaused = false;
        applyPlayerState(state, true);
        return;
      }

      if (!state.paused) {
        applyPlayerState(state, false);
        return;
      }

      // paused:true — only trust when the user explicitly paused, or playback
      // genuinely stopped (not during a REST transfer blip / position advance).
      if (isWithinTransferWindow()) {
        console.debug('[PlayerSection] Ignoring paused:true during post-transfer window');
        previousStateRef.current = state;
        return;
      }

      if (positionAdvancing) {
        console.debug('[PlayerSection] Ignoring paused:true — position still advancing');
        setIsPlaying(true);
        previousStateRef.current = state;
        return;
      }

      if (!playbackRef.current.userPaused) {
        console.debug('[PlayerSection] Ignoring paused:true — no user pause action');
        previousStateRef.current = state;
        return;
      }

      applyPlayerState(state, true);
    }

    player.addListener('player_state_changed', handleStateChange);
    return () => player.removeListener('player_state_changed', handleStateChange);
  }, [player, setIsPlaying, setPlayerStateChangedLocal, createdBy, user]);

  // send playback status updates to the server — but ONLY on real transitions
  // (paused toggled or track changed), not on every per-second position tick
  // the SDK fires during normal playback.
  const playerStateChanged = usePlayerStore((state) => state.playerStateChanged);
  const updatePlaybackStatus = useWebSocketStore((state) => state.updatePlaybackStatus);
  const roomCode = useWebSocketStore((state) => state.roomState.roomCode);
  const lastBroadcastRef = useRef({ paused: null, duration: null });

  useEffect(() => {
    if (!playerStateChanged) return;

    // Ignore updates that originated from the server to prevent loops
    if (playerStateChanged.source && playerStateChanged.source !== 'local') return;

    const { paused, duration } = playerStateChanged;
    const last = lastBroadcastRef.current;

    // Never broadcast a spurious pause — the SDK fires these after REST transfers.
    if (paused && !playbackRef.current.userPaused) return;

    // position is intentionally excluded — it changes every tick during playback
    const isRealTransition = last.paused !== paused || last.duration !== duration;

    if (!isRealTransition) return;

    lastBroadcastRef.current = { paused, duration };

    updatePlaybackStatus(
      playerStateChanged.duration,
      playerStateChanged.position,
      playerStateChanged.paused,
      roomCode,
      currentSong
    );
  }, [playerStateChanged, updatePlaybackStatus, roomCode, currentSong]);

  function handleTogglePlay() {
    if (!player) return;
    playbackRef.current.userPaused = isPlaying;
    console.log('hanldeTogglePlay pressed!')
    player.togglePlay().catch((err) => {
      console.error('[PlayerSection] togglePlay failed:', err);
      playbackRef.current.userPaused = !isPlaying;
    });
  }

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col relative bg-black/0">

      {
        (currentSong) ? (
          <>
          <img
        src={currentSong.media_img || currentSong.thumbnail_img}
        alt=""
        className="absolute inset-0 w-full h-full object-contain object-center"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(180deg, ${accentColor} 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 1) 100%)`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="p-4 md:p-8 flex-grow flex flex-col justify-between overflow-y-auto relative z-10">

        <div className="flex justify-center mb-3 md:mb-6">
          <div className="relative w-32 h-32 md:w-54 md:h-54 lg:w-56 lg:h-56">

            <div
              className="absolute"
              style={{ left: '50%', top: 0, width: '100%', height: '100%' }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{
                  animation: 'spin-vinyl 5s linear infinite',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  transformOrigin: '50% 50%',
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.55))',
                }}
              >
                <defs>
                  <radialGradient id="vinylSheen" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="55%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  <clipPath id="labelClip">
                    <circle cx="50" cy="50" r="16" />
                  </clipPath>
                </defs>

                <circle cx="50" cy="50" r="48" fill={accentColor} />

                {[44, 40, 36, 32, 28, 24, 20.5].map((r) => (
                  <circle
                    key={r}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="0.5"
                  />
                ))}

                <circle cx="50" cy="50" r="48" fill="url(#vinylSheen)" />

                <circle cx="50" cy="50" r="17" fill="#111" />
                <image
                  href={currentSong.media_img || currentSong.thumbnail_img}
                  x="34"
                  y="34"
                  width="32"
                  height="32"
                  clipPath="url(#labelClip)"
                  preserveAspectRatio="xMidYMid slice"
                />

                <circle cx="50" cy="50" r="2.2" fill="#000" />
                <circle cx="50" cy="50" r="2.2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
              </svg>
            </div>

            <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl z-10 bg-black">
              <img
                src={currentSong.media_img || currentSong.thumbnail_img}
                alt={currentSong.track_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>

          <style>{`
            @keyframes spin-vinyl {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-white text-base md:text-2lg lg:text-4xl font-semibold mb-2 md:mb-4 text-shadow-2xl">
            {currentSong.track_name}
          </h2>
          <p className='text-white text-shadow-2xl'>{currentSong.artist_name}</p>
        </div>

        <PlaybackTimeline/>


        {(createdBy?._id === user?.id) ? (
                <div className="grid grid-cols-3 items-center w-full">
                  <div></div>
                  <div className="flex justify-center">
                    <button
                      onClick={handleTogglePlay}
                      className="bg-white hover:bg-white text-black rounded-full p-3 md:p-4 text-lg md:text-2xl transition-colors duration-200 shadow-lg cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
                    </button>
                  </div>
                  <div className="flex justify-start pl-4 md:pl-8">
                    <button
                      className="text-white/60 hover:text-white text-base md:text-2xl transition-colors duration-200 cursor-pointer"
                      title="Next"
                      onClick={handlePlaySong}
                    >
                      <FaStepForward />
                    </button>
                  </div>
                </div>
        ) : (
          <div></div>
        )}
        



      </div>
      </>
        ) : (
            <div className='flex flex-col justify-center items-center text-white h-full min-h-120'>
              <div className="perspective-[1000px]">
                <img
                  src={track_img}
                  className="h-45 lg:h-65 transform-3d rotate-x-6 hover:rotate-y-22 hover:-rotate-x-6 transition-transform duration-300"
                />
              </div>
              <h1 className=' text-4xl '>Nothing Playing!</h1>
              <p className='text-sm text-gray-400 mb-3'>You have to add tracks in a Queue to play music.</p>
              {isReady ? (
                <p className="text-white px-5 rounded-xl bg-green-700">Player ready! You can play music.</p>
              ) : (
                <p className="text-white px-5 animate-pulse rounded-xl bg-red-600">
                  Wait, getting your player ready...
                </p>
              )}

              <button className='w-full md:w-auto py-2 md:px-10 cursor-pointer border rounded-4xl mt-5 hover:bg-white hover:text-black' onClick={handlePlaySong}>
                Start Playing Song
              </button>

            </div>
        )
      }
    </div>

  );
}