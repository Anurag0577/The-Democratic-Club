import { useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';
import { usePlayerStore } from '../store/usePlayerStore.js';

export function useSpotifyPlayer() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const playerRef = useRef(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate initialization in React 18 Strict Mode
    if (playerRef.current || isInitializingRef.current) return;

    const initializePlayer = () => {
      if (!window.Spotify?.Player || playerRef.current) return;

      isInitializingRef.current = true;

      const spotifyPlayer = new window.Spotify.Player({
        name: 'The Democratic Club',
        getOAuthToken: async (cb) => {
          try {
            const res = await api.get('/auth/playback-token', { withCredentials: true });
            if (res.data?.access_token) {
              cb(res.data.access_token);
            } else {
              console.error('[Spotify SDK] Access token missing from endpoint response');
            }
          } catch (err) {
            console.error('[Spotify SDK] Failed to fetch playback token:', err);
          }
        },
        volume: 0.8,
      });

      // SDK READY EVENT
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('[Spotify SDK] Ready with Device ID:', device_id);

        // Ensure audio volume is explicitly unmuted
        spotifyPlayer.setVolume(0.8).catch(() => {});

        // 1. Update local hook state
        setDeviceId(device_id);
        setIsReady(true);

        // 2.  SYNC DIRECTLY WITH ZUSTAND STORE
        usePlayerStore.setState({
          deviceId: device_id,
          isReady: true,
          isSdkReady: true,
          sdkPlayer: spotifyPlayer,
        });
      });

      //  SDK OFFLINE / NOT READY
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('[Spotify SDK] Device offline:', device_id);
        setDeviceId(null);
        setIsReady(false);

        usePlayerStore.setState({
          deviceId: null,
          isReady: false,
          isSdkReady: false,
        });
      });

      // SDK ERRORS
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('[Spotify SDK] Init error:', message);
        setIsReady(false);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('[Spotify SDK] Auth error:', message);
        setIsReady(false);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('[Spotify SDK] Account error (Premium required):', message);
        setIsReady(false);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.connect();
      playerRef.current = spotifyPlayer;
      setPlayer(spotifyPlayer);
      isInitializingRef.current = false;
    };



    // ------ CODE START FROM HERE -----------
    if (window.Spotify?.Player) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;

      if (!document.getElementById('spotify-player-sdk')) {
        const script = document.createElement('script');
        script.id = 'spotify-player-sdk';
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        script.onload = () => {
          if (window.Spotify?.Player) {
            initializePlayer();
          }
        };
        script.onerror = () => {
          console.error('[Spotify SDK] Failed to load Web Playback SDK script.');
          isInitializingRef.current = false;
        };
        document.body.appendChild(script);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }
      isInitializingRef.current = false;
      setPlayer(null);
      setIsReady(false);

      usePlayerStore.setState({
        sdkPlayer: null,
        isReady: false,
        isSdkReady: false,
      });
    };
  }, []);

  return { player, deviceId, isReady };
}