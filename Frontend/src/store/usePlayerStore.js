import { create } from 'zustand';

export const usePlayerStore = create((set, get) => ({

  currentSong: {
    title: 'Winning Speech',
    artist: 'Karan Aujla',
    album: 'Four You',
    genre: 'Punjabi',
    year: '2021',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2736c8802411130056f447257a6',
    requestedBy: 'Armaan Singh',
    requestedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
    currentTime: 21,
    totalTime: 190,
    currentTimeFormatted: '0:21',
    totalTimeFormatted: '3:10',
  },
  isPlaying: false,

  setCurrentSong: (track) => set({ currentSong: track }),
  setIsPlaying: (status) => set({ isPlaying: status }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));