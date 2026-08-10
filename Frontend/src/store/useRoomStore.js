import {create} from 'zustand';

const useRoomStore = create((set, get) => ({
    accentColor: '#800000' ,
    queue: [],
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
    setAccentColor : (colorCode) => set({accentColor : colorCode}),
    setQueue : (updateQueue) => set({queue : updateQueue}),
    setTotalMember : (count) => set({totalMember : count}),
    setRoom : (info) => set({room : info})
}))

export {useRoomStore};