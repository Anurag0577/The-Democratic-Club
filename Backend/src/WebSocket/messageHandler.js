import { queryObjects } from 'v8';
import { Room } from '../Models/room.model.js'
import {messageType} from '../WebSocket/messageType.js'
import { joinRoom, leaveRoom, broadCastToRoom } from './roomConnection.js'
import { getQueue, setQueue, upvoteSong, removeUpvoteSong } from './roomState.js'
import { type } from 'os';

async function messageHandler(socket, data){
    try {
        switch(data.type){

            // --------  JOIN ROOM [ roomCode ]  ----------------
            case messageType.JOIN_ROOM : {
                console.log('JOIN ROOM inside code start executing!')
                const roomCode = data.payload?.roomCode;
                const userId = data.payload?.userId;
                if(!roomCode || !userId) {
                    console.log('Room code or user id did not found! Sending error message to frontend!')
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Missing roomCode'
                    }));
                }

                joinRoom(roomCode, socket);


                const updatedRoom = await Room.findOneAndUpdate(
                    {roomCode : roomCode},
                    { $addToSet: { members: userId } },
                    { new: true } // Returns the updated document
                );
                
                if(!updatedRoom) {
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Room not found'
                    }));
                }

                

                const members = updatedRoom.members;
                const queue = await getQueue(updatedRoom.roomCode, updatedRoom._id);
                const response = JSON.stringify({
                    type: messageType.CURRENT_ROOM_STATE,
                    payload : {
                        queue,
                        members,
                        room: updatedRoom
                    }
                })
                console.log('Backend ->  frontend : ', response)

                socket.send(response);

                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    payload: {
                        members
                    }
                });

                break;
            }

            // ------------ LEAVE ROOM [ userId ] ------------
            case messageType.LEAVE_ROOM : {
                const roomCode = socket.roomCode;
                const userId = data.payload?.userId;

                if(!roomCode){
                    return socket.send(JSON.stringify({
                            type: messageType.ERROR,
                            payload: 'Room not found'
                        }));
                }

                leaveRoom(socket);

                if(!userId) break;

                const updatedRoom = await Room.findOneAndUpdate(
                    { roomCode },
                    { $pull: { members: userId } },
                    { new: true }
                ).lean();

                if(!updatedRoom) break;

                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    payload: {
                        members: updatedRoom.members
                    }
                });

                break;
            }

            // --------------- ADD SONG [ track , roomCode, roomId ] ------------------
            case messageType.ADD_SONG : {
                const { track, roomCode, roomId } = data.payload ?? {};
                if (!track || !roomCode || !roomId) break;

                const updateQueue = await setQueue(roomCode, track, 'add', roomId);

                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    payload: { queue: updateQueue }
                });
                break;
            }

            // ------------ REMOVE SONG [ track, roomCode, roomId  ]
            case messageType.REMOVE_SONG : {
                const { track, roomCode, roomId } = data.payload ?? {};
                if (!track || !roomCode || !roomId) break;

                const updateQueue = await setQueue(roomCode, track, 'remove', roomId);

                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    payload: { queue: updateQueue }
                });
                break;
            }

            // ------------- ADD UPVOTE [ roomId, track_id, roomCode ]
            case messageType.ADD_UPVOTE : {

                const track_id = data?.payload?.track_id;
                const roomCode = data?.payload?.roomCode;
                const roomId = data?.payload?.roomId;
                const upvoted_by = data?.payload?.upvoted_by

                const updatedQueue = await upvoteSong(track_id, roomCode, roomId, upvoted_by);
                console.log('This is UPDATED QUEUE AFTER UPVOTE', updatedQueue)
                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    payload: { queue: updatedQueue }
                });

                break;
            }

            // ------------- REMOVE UPVOTE [ room_id, track_id, roomCode ]
            case messageType.REMOVE_UPVOTE : {
                const track_id = data?.payload?.track_id;
                const roomCode = data?.payload?.roomCode;
                const roomId = data?.payload?.roomId;
                const removedUpvote_by = data?.payload?.removedUpvote_by;

                const updatedQueue = await removeUpvoteSong(track_id, roomCode, roomId, removedUpvote_by);

                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    payload: { queue: updatedQueue }
                });

                break;
            }

            // ------------ CHANGE SONG [ track, roomCode ] ------------
            case messageType.SONG_CHANGED : {
                const {track, roomCode} = data.payload || {};

                broadCastToRoom(roomCode, {
                    type:messageType.NOW_PLAYING,
                    payload: {track: track}
                })
                break;
            }

            // -------------- UPDATE PAYBACK STATUS -------------------------
            case messageType.UPADATE_PLAYBACK_STATUS : {
                const {duration, position, paused, roomCode} = data?.payload || {};

                broadCastToRoom(roomCode, {
                    type: messageType.PLAYBACK_STATUS,
                    payload: {duration, position, paused}
                })
                break;
            }
            
        }
    } catch(err) {
        console.error('messageHandler error:', err);
        try {
            socket.send(JSON.stringify({
                type: messageType.ERROR,
                payload: 'Server error'
            }));
        } catch(e) {

        }
    }
}

export {messageHandler}