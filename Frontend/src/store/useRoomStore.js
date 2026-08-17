import {create} from 'zustand';

const useRoomStore = create((set, get) => ({
    accentColor: '#800000' ,
    queue: [],
    room: {
        _id : '1234',
        roomCode: '1234',
        roomName: `Anurag's Room`,
        createdBy: 'Armaan Singh'
    },
    totalMember: 1,
    
    // action functions
    setAccentColor : (colorCode) => set({accentColor : colorCode}),
    setQueue : (updateQueue) => set({queue : updateQueue}),
    setTotalMember : (count) => set({totalMember : count}),
    setRoom : (info) => set({room : info})
}))

export {useRoomStore};