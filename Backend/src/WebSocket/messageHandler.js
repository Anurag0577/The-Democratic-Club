import { queryObjects } from 'v8';
import { Room } from '../Models/room.model.js'
import {messageType} from '../WebSocket/messageType.js'
import { joinRoom, leaveRoom, broadCastToRoom } from './roomConnection.js'
import { getQueue, setQueue, upvoteSong } from './roomState.js'

async function messageHandler(socket, data){
    try {
        switch(data.type){

            // --------  JOIN ROOM [ roomCode ]  ----------------
            case messageType.JOIN_ROOM : {
                
                const roomCode = data.roomCode;

                if(!roomCode) {
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Missing roomCode'
                    }));
                }

                joinRoom(roomCode, socket);

                const room = await Room.findOne({ roomCode }).lean();
                
                if(!room) {
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Room not found'
                    }));
                }

                const memberCount = room.members?.length || 0;
                const queue = await getQueue(room.roomCode, room._id);

                socket.send(JSON.stringify({
                    type: messageType.CURRENT_ROOM_STATE,
                    queue, // this is array of object
                    memberCount,
                    room
                }));

                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    count: memberCount,
                    memberList: room.members
                });

                break;
            }

            // ------------ LEAVE ROOM [  ] ------------
            case messageType.LEAVE_ROOM : {
                leaveRoom(socket);
                const roomCode = socket.roomCode;
                if(!roomCode){
                    return socket.send(JSON.stringify({
                            type: messageType.ERROR,
                            payload: 'Room not found'
                        }));
                }
  
                const room = await Room.findOne({roomCode}).lean();
                const memberCount = room.members?.length || 0;

                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    count: memberCount,
                    memberList: room.members
                });

                break;
            }

            // --------------- ADD SONG [ track , roomCode, roomId ] ------------------
            case messageType.ADD_SONG : {
                let track = JSON.parse(data.track)
                const updateQueue =  await setQueue(data.roomCode, track, add, data.roomId);

                broadCastToRoom(data.roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    queue: updateQueue
                })
            }

            // ------------ REMOVE SONG [ track, roomCode, roomId  ]
            case messageType.REMOVE_SONG : {
                let track = JSON.parse(data.track);
                const updateQueue = await setQueue(data.roomCode, track, remove, data.roomId);

                broadCastToRoom(data.roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    queue: updateQueue
                })
            }

            // ------------- ADD UPVOTE [ roomId, track_id, roomCode ]
            case messageType.ADD_UPVOTE : {
    
                const track_id = data.track_id;
                const roomCode = data.roomCode;
                const roomId = data.roomId;  
                
                const updatedQueue = upvoteSong(track_id, roomCode, roomId);

                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    queue: updatedQueue
                })
            }

            // ------------- REMOVE UPVOTE [ room_id, track_id, roomCode ]
            case messageType.REMOVE_UPVOTE : {
                const track_id = data.track_id;
                const roomCode = data.roomCode;
                const roomId = data.roomId;  

                const updatedQueue = removeUpvoteSong(track_id, roomCode, roomId);

                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    queue: updatedQueue
                })
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