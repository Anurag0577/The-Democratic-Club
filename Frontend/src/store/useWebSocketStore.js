import {create} from "zustand";
import { websocketService } from "../services/websocketServices.js";
import {messageType} from "../Utilities/messageType.js"
import { usePlayerStore } from "./usePlayerStore.js";

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

        get().registerHanlders();


        websocketService.connect(roomId, userId, () => {
            websocketService.sendMessage(messageType.JOIN_ROOM, {roomCode, userId});
        });

        set({
            error: null,
            currentRoomId: roomId,
            currentUserId: userId,
            roomState: { ...get().roomState, roomCode: roomCode },
        });
    },

    leaveRoom: () => {
        const { currentUserId, roomState } = get();
        websocketService.sendMessage(messageType.LEAVE_ROOM, {
            userId: currentUserId,
            roomCode: roomState.roomCode,
        });
        websocketService.disconnect();
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

    },

    registerHanlders : () => {

        websocketService.onMessage(messageType.QUEUE_UPDATE, (payload) => {
            console.log("Queue updated!", payload.queue)
            set((state) => ({
                roomState : {...state.roomState, queue: payload.queue}
            }))
            console.log(get().roomState)
        })

        websocketService.onMessage(messageType.NOW_PLAYING, (payload) => {
            console.log("Now playing track information", payload.track )
            usePlayerStore.getState().setCurrentSong(payload.track);
            const playbackStatusObj = {
                duration: payload.track?.song_dur,
                position: 0,
                paused: false
            }
            usePlayerStore.getState().setPlayerStateChangedRemote(playbackStatusObj)
            usePlayerStore.getState().setIsPlaying(true);
        })

        // websocketService.onMessage(messageType.PLAYBACK_STATUS, (payload) => {
        //     console.log("Playback status", payload.isPlaying);
        //     set(state => ({
        //         roomState: {...state.roomState, isPlaying: payload.isPlaying}
        //     }))
        // })

        websocketService.onMessage(messageType.MEMBER_UPDATED, (payload) => {
            console.log("Member update", payload.members )
            set((state) => ({
                roomState: {...state.roomState, members: payload.members}
            }))
            console.log(get().roomState)
        })

        websocketService.onMessage(messageType.ERROR, (payload) => {
            console.error('Server error:', payload);
            set({ error: payload.message || 'An error occurred' });
        });

        websocketService.onMessage(messageType.CURRENT_ROOM_STATE, (payload) => {
            console.log("current room status", payload);
            set((state) => ({
                roomState: {
                    ...state.roomState,
                    queue: payload.queue ?? [],
                    members: payload.members ?? payload.room?.members ?? [],
                    roomCode: payload.room?.roomCode ?? state.roomState.roomCode,
                },
            }));
            console.log('-- this is the value of current roomState', get().roomState)
        });

        websocketService.onMessage(messageType.PLAYBACK_STATUS, (payload) => {
            console.log('Updated playback status', payload)
            usePlayerStore.getState().setPlayerStateChangedRemote(payload);
        })

    },

    // SEND MESSAGES TO THE WEBSOCKET SERVER

    addSong : (track, roomCode, roomId) => {
        websocketService.sendMessage(messageType.ADD_SONG, {track, roomCode, roomId})
    },

    removeSong : (track, roomCode, roomId) => {
        websocketService.sendMessage(messageType.REMOVE_SONG, {track, roomCode, roomId})
    },

    addUpvote : (track_id, roomId, roomCode, upvoted_by) => {
        websocketService.sendMessage(messageType.ADD_UPVOTE, {track_id, roomId, roomCode, upvoted_by})
    },

    removeUpvote : (track_id, roomId, roomCode, removedUpvote_by) => {
        websocketService.sendMessage(messageType.REMOVE_UPVOTE, {track_id, roomId, roomCode, removedUpvote_by})
    },

    songChanged : (track, roomCode) => {
        websocketService.sendMessage(messageType.SONG_CHANGED, { track, roomCode})
    },

    play: () => {
        websocketService.sendMessage(messageType.PLAY, {});
    },

    pause: () => {
        websocketService.sendMessage(messageType.PAUSE, {});
    },

    updatePlaybackStatus: (duration, position, paused, roomCode) => {
        websocketService.sendMessage(messageType.UPADATE_PLAYBACK_STATUS, {duration, position, paused, roomCode})
    }

}))

export {useWebSocketStore};