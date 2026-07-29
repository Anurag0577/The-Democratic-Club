import {create} from "zustand";
import { websocketService } from "../services/websocketServices.js";
import {messageType} from "../Utilities/messageType.js"
const useWebSocketStore = create((get, set) => ({
    // states
    roomState: {
        queue: [],
        nowPlaying: null,
        members: [],
        isPlaying: false,
        roomCode: null
    },
    currentUserId: null,
    currentRoomId: null,
    error: null,

    joinRoom: (roomId, userId, roomCode) => {
        websocketService.connect(roomId, userId);
        set({
            error: null,
            currentRoomId: roomId,
            currentUserId: userId,
            roomState: { ...get().roomState, roomCode: roomCode },
        })

        websocketService.sendMessage(messageType.JOIN_ROOM, {roomCode});

        
    },

    leaveRoom: () => {
        websocketService.disconnected();
        set({
            roomState : {
                queue: [],
                nowPlaying: null,
                members: [],
                isPlaying: null,
                roomCode: null
            },
            currentRoomId: null,
            currentUserId: null,
        })

        websocketService.sendMessage(messageType.LEAVE_ROOM, {})
    },

    registerHanlders : () => {

        websocketService.onmessage(messageType.QUEUE_UPDATE, (payload) => {
            console.log("Queue updated!", payload.queue)
            // when get this type of value just update the queue
            set((state) => ({
                roomState : {...state.roomState, queue: payload.queue}
            }))
        })

        websocketService.onmessage(messageType.NOW_PLAYING, (payload) => {
            console.log("Now playing track information", payload.track )
            set((state) => ({
                roomState : {...state.roomState, nowPlaying: payload.track}
            }))
        })

        websocketService.onmessage(messageType.PLAYBACK_STATUS, (payload) => {
            console.log("Playback status", payload.isPlaying);
            set(state => ({
                roomState: {...state.roomState, isPlaying: payload.isPlaying}
            }))
        })

        websocketService.onmessage(messageType.MEMBER_UPDATED, (payload) => {
            console.log("Member update", payload.memberList )
            set((state) => ({
                roomCode: {...state.roomState, members: payload.memberList}
            }))
        })

        websocketService.onMessage(messageType.ERROR, (payload) => {
            console.error('Server error:', payload);
            set({ error: payload.message || 'An error occurred' });
        });

    }

}))

export {useWebSocketStore};