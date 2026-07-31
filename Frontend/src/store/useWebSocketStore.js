import {create} from "zustand";
import { websocketService } from "../services/websocketServices.js";
import {messageType} from "../Utilities/messageType.js"
const useWebSocketStore = create((set, get) => ({
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

        get().registerHanlders();
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

        websocketService.onMessage(messageType.QUEUE_UPDATE, (payload) => {
            console.log("Queue updated!", payload.queue)
            // when get this type of value just update the queue
            set((state) => ({
                roomState : {...state.roomState, queue: payload.queue}
            }))
        })

        websocketService.onMessage(messageType.NOW_PLAYING, (payload) => {
            console.log("Now playing track information", payload.track )
            set((state) => ({
                roomState : {...state.roomState, nowPlaying: payload.track}
            }))
        })

        websocketService.onMessage(messageType.PLAYBACK_STATUS, (payload) => {
            console.log("Playback status", payload.isPlaying);
            set(state => ({
                roomState: {...state.roomState, isPlaying: payload.isPlaying}
            }))
        })

        websocketService.onMessage(messageType.MEMBER_UPDATED, (payload) => {
            console.log("Member update", payload.memberList )
            set((state) => ({
                roomState: {...state.roomState, members: payload.memberList}
            }))
        })

        websocketService.onMessage(messageType.ERROR, (payload) => {
            console.error('Server error:', payload);
            set({ error: payload.message || 'An error occurred' });
        });

    },

    // SEND MESSAGES TO THE WEBSOCKET SERVER

    addSong : (track, roomCode, roomId) => {
        websocketService.sendMessage(messageType.ADD_SONG, {track, roomCode, roomId})
    },

    removeSong : (track, roomCode, roomId) => {
        websocketService.sendMessage(messageType.REMOVE_SONG, {track, roomCode, roomId})
    },

    addUpvote : (track_id, roomId, roomCode) => {
        websocketService.sendMessage(messageType.ADD_UPVOTE, {track_id, roomId, roomCode})
    },

    removeUpvote : (track_id, roomId, roomCode) => {
        websocketService.sendMessage(messageType.REMOVE_UPVOTE, {track_id, roomId, roomCode})
    },

    play: () => {
        websocketService.sendMessage(messageType.PLAY, {});
    },

    pause: () => {
        websocketService.sendMessage(messageType.PAUSE, {});
    },

    skipSong: () => {
        websocketService.sendMessage(messageType.SKIP_SONG, {});
    },

}))

export {useWebSocketStore};