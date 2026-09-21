/*
Guide to setup a Spotify Player
1. Download the script <script src="https://sdk.scdn.co/spotify-player.js"></script>
2. Once the script is downloaded, we'll initialised the spotify playback SDk.
3. Write handler to handle different events

*/

import { useEffect } from 'react';
import { useRef } from 'react';
import { toast } from 'sonner'
import { usePlayerStore } from '../store/usePlayerStore.js';
import api from '../api/axios.js'

export function useSpotifyPlayer() {

  // zustand variable and actions
  const spotifyPlayer = usePlayerStore(state => state.spotifyPlayer);
  const isPlayerReady = usePlayerStore(state => state.isPlayerReady);
  const device = usePlayerStore(state => state.device);

  const playerRef = useRef(null);
  const isPlayerInitializingRef = useRef(false);

  useEffect(() => {

    if (isPlayerInitializingRef.current || playerRef.current) return;


    const initializePlayer = () => {
      if (!window.Spotify?.Player || playerRef.current) return;
      isPlayerInitializingRef.current = true;

      const spotifyPlayer = new window.Spotify.Player({
        name: 'Spotify-playback-sdk',
        getOAuthToken: async (cb) => {
          try {
            const res = await api.get('/auth/playback-token', { withCredentials: true });
            const accessToken = res.data?.access_token;
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
        toast.message(`The Spotify Playback SDK ready with deviceId: ${device_id}.`)
        console.log(`The Spotify Playback SDK ready with deviceId: ${device_id}.`)

        usePlayerStore.setState({
          spotifyPlayer,
          device: device_id,
          isPlayerReady: true
        });
      });

      spotifyPlayer.addListener('not_ready', () => {
        toast.message('The spotify playback SDK is offline.')
        console.log('The spotify playback SDK is offline.')
        usePlayerStore.setState({
          device: null,
          isPlayerReady: false
        })
      })

      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('[Spotify SDK] Init error:', message);
        usePlayerStore.setState({
          spotifyPlayer: null,
          device: null,
          isPlayerReady: false,
        });

      })

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Auth error related to Spotify Playback SDK:', message);
        usePlayerStore.setState({
          spotifyPlayer: null,
          device: null,
          isPlayerReady: false,
        });
      })

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Premium required for Spotify Playback SDk:', message);
        usePlayerStore.setState({
          spotifyPlayer: null,
          device: null,
          isPlayerReady: false,
        });
      })

      // till this line we just creating the instance of Spotify Playback SDK, we did not connect to anything.

      // now we need to register the device with spotify
        spotifyPlayer.connect();
        playerRef.current = spotifyPlayer;
        isPlayerInitializingRef.current = false
        toast.message('Your can Play songs now!')
    }

    // STEP 01: DOWNLOAD THE SCRIPT IN THE HTML
    if (window.Spotify?.Player) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer; // this will automatically triggerd when the script is loaded.
      if (!document.getElementById('spotify-player-sdk')) {

        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.id = 'spotify-player-sdk';
        script.async = true;
        script.onload = () => {
          if (window.Spotify?.Player) {
            initializePlayer();
          }
        };
        script.onerror = () => {
          toast.error('Error downloading the Spotify Player SDK script!')
          console.log('Error downloading the Spotify Player SDK script!')
          isPlayerInitializingRef.current = false;
        }
        document.body.appendChild(script)
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }

      isPlayerInitializingRef.current = false;

      usePlayerStore.setState({
        spotifyPlayer: null,
        device: null,
        isPlayerReady: false
      })

    }
  }, [])

  return {
    spotifyPlayer,
    isPlayerReady,
    device
  }
}
