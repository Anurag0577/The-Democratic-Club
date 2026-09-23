import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  isSdkReady: false,
  playerStateChanged: {
    duration: 0,
    position: 0,
    paused: true,
    source: 'local'
  },

  // NEWLY CREATED
  isPlayerReady : false,
  device : null,
  spotifyPlayer : null,
  isPlaying: false,
  currentSong: null,

  setCurrentSong: (track) => set({ currentSong: track }),
  setIsPlaying: (status) => set({ isPlaying: status }),
  setSdkPlayer: (player) => set({ spotifyPlayer: player }),
  setIsSdkReady: (ready) => set({ isSdkReady: ready }),
  setIsReady: (ready) => set({ isReady: ready }),
  setDeviceId: (id) => set({ deviceId: id }),
}));