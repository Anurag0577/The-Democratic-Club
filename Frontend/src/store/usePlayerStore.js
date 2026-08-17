import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sdkPlayer: null,
  isSdkReady: false,
  deviceId: null,
  playerStateChanged: {
    duration: 0,
    position:0,
    paused: true,
    source: 'local'
  },

  // To avoid broadcast loops, mark whether the update originated locally or remotely.
  // Local changes come from the SDK/player and should be sent to the server.
  // Remote changes come from the server and should not be re-broadcast.
  setPlayerStateChangedLocal: (obj) => set((state) => ({
    playerStateChanged: { ...obj, source: 'local' },
    isPlaying: typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying,
  })),
  setPlayerStateChangedRemote: (obj) => set((state) => ({
    playerStateChanged: { ...obj, source: 'remote' },
    isPlaying: typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying,
  })),
  // Backward-compatible setter: defaults to local origin
  setPlayerStateChanged: (obj) => set((state) => ({
    playerStateChanged: { ...obj, source: 'local' },
    isPlaying: typeof obj?.paused === 'boolean' ? !obj.paused : state.isPlaying,
  })),
  setCurrentSong: (track) => set({ currentSong: track }),
  setIsPlaying: (status) => set({ isPlaying: status }),
  setSdkPlayer: (player) => set({ sdkPlayer: player }),
  setIsSdkReady: (ready) => set({ isSdkReady: ready }),
  setDeviceId: (id) => set({ deviceId: id }), // add this
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

}));