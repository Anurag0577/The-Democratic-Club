import {create} from 'zustand';
import { useAccentColor } from '../hooks/useAccentColor';

const useRoomStore = create((set, get) => ({
    currentSong: {},
    // accentColor: (currentSong) ? useAccentColor(currentSong?.imageUrl) : '#800000' ,
    accentColor: '#800000' ,
    queue: [],
    isPlaying: false,
    room: {
        roomName: `Anurag's Room`,
        createdDate: 'May 12, 2024',
        hostName: 'Armaan Singh',
        totalMembers: 24,
        nowPlayingTime: '0:21 / 3:10',
        roomCode: '1234',
        shareLink: 'thedemocraticclub.com/room/1234',
    },
    totalMember: 1,
    
    // action functions
    setCurrentSong : (songInfo) => set({currentSong : songInfo}),
    setAccentColor : (colorCode) => set({accentColor : colorCode}),
    setQueue : (updateQueue) => set({queue : updateQueue}),
    setIsPlaying : (isPlaying) => set({isPlaying: isPlaying}),
    setTotalMember : (count) => set({totalMember : count}),
    setRoom : (info) => set({room : info})
}))

export {useRoomStore};