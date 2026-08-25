import { useEffect, useRef } from 'react';
import api from '../api/axios.js';
import { usePlayerStore } from '../store/usePlayerStore.js';

export function useSpotifyPlayer() {
  // Single source of truth: read directly from the Zustand store.
  // No parallel useState — avoids two copies of the same data drifting apart.
  const player = usePlayerStore((state) => state.sdkPlayer);
  const deviceId = usePlayerStore((state) => state.deviceId);
  const isReady = usePlayerStore((state) => state.isReady);

  const playerRef = useRef(null);
  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (playerRef.current || isInitializingRef.current) return;

    const initializePlayer = () => {
      if (!window.Spotify?.Player || playerRef.current) return;

      isInitializingRef.current = true;

      const spotifyPlayer = new window.Spotify.Player({
        name: 'The Democratic Club',
        getOAuthToken: async (cb) => {
          try {
            const res = await api.get('/auth/playback-token', { withCredentials: true });
            const accessToken = res.data?.data?.access_token;
            if (accessToken) {
              cb(accessToken);
            } else {
              console.error('[Spotify SDK] Access token missing from endpoint response', res.data);
            }
          } catch (err) {
            console.error('[Spotify SDK] Failed to fetch playback token:', err);
          }
        },
        volume: 0.8,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('[Spotify SDK] Ready with Device ID:', device_id);
        spotifyPlayer.setVolume(0.8).catch(() => {});

        usePlayerStore.setState({
          deviceId: device_id,
          isReady: true,
          isSdkReady: true,
          sdkPlayer: spotifyPlayer,
        });
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('[Spotify SDK] Device offline:', device_id);
        usePlayerStore.setState({
          deviceId: null,
          isReady: false,
          isSdkReady: false,
        });
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('[Spotify SDK] Init error:', message);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('[Spotify SDK] Auth error:', message);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('[Spotify SDK] Account error (Premium required):', message);
        usePlayerStore.setState({ isReady: false, isSdkReady: false });
      });

      spotifyPlayer.connect();
      playerRef.current = spotifyPlayer;
      isInitializingRef.current = false;
    };

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

      usePlayerStore.setState({
        sdkPlayer: null,
        deviceId: null,
        isReady: false,
        isSdkReady: false,
      });
    };
  }, []);

  return { player, deviceId, isReady };
}