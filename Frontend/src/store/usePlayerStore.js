import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sdkPlayer: null,
  isSdkReady: false,
  isReady: false,
  deviceId: null,
  playerStateChanged: {
    duration: 0,
    position: 0,
    paused: true,
    source: 'local'
  },

  setPlayerStateChangedLocal: (obj) => set((state) => ({
    playerStateChanged: { ...obj, source: 'local' },
    isPlaying: typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying,
  })),
  setPlayerStateChangedRemote: (obj, options = {}) => set((state) => ({
    playerStateChanged: { ...obj, source: 'remote' },
    isPlaying: options.syncIsPlaying === false
      ? state.isPlaying
      : (typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying),
  })),
  setPlayerStateChanged: (obj) => set((state) => ({
    playerStateChanged: { ...obj, source: 'local' },
    isPlaying: typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying,
  })),
  setCurrentSong: (track) => set({ currentSong: track }),
  setIsPlaying: (status) => set({ isPlaying: status }),
  setSdkPlayer: (player) => set({ sdkPlayer: player }),
  setIsSdkReady: (ready) => set({ isSdkReady: ready }),
  setIsReady: (ready) => set({ isReady: ready }),
  setDeviceId: (id) => set({ deviceId: id }),
}));