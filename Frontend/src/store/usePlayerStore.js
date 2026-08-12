import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sdkPlayer: null,
  isSdkReady: false,
  deviceId: null, // add this

  setCurrentSong: (track) => set({ currentSong: track }),
  setIsPlaying: (status) => set({ isPlaying: status }),
  setSdkPlayer: (player) => set({ sdkPlayer: player }),
  setIsSdkReady: (ready) => set({ isSdkReady: ready }),
  setDeviceId: (id) => set({ deviceId: id }), // add this
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));