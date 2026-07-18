import { Room } from '../Models/room.model.js'
import {messageType} from '../WebSocket/messageType.js'
import { joinRoom, leaveRoom, broadCastToRoom } from './roomConnection.js'
import { getQueue, setQueue } from './roomState.js'

async function messageHandler(socket, data){
    try {
        switch(data.type){

            // JOIN ROOM
            case messageType.JOIN_ROOM : {
                const roomCode = data.roomCode;
                
                // Validate roomCode exists
                if(!roomCode) {
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Missing roomCode'
                    }));
                }

                // Add socket to in-memory room map
                joinRoom(roomCode, socket);

                /*
                1. fetch the list of members from the DB
                2. try to fetch queue current state from redis 
                3. if not found just fetch it from the DB
                4. Now sync current ROOM_STATE for the current user
                5. Broadcast 'MEMBER_UPDATE' to every other users in the room
                */

                // Fetch room from DB using roomCode (not _id)
                const room = await Room.findOne({ roomCode });
                
                if(!room) {
                    return socket.send(JSON.stringify({
                        type: messageType.ERROR,
                        payload: 'Room not found'
                    }));
                }

                const memberCount = room.members?.length || 0;

                // Fetch the latest queue state (await the async call)
                const queue = await getQueue(room._id);

                // Send the current room state to current user only
                socket.send(JSON.stringify({
                    type: messageType.CURRENT_ROOM_STATE,
                    queue,
                    memberCount,
                    room
                }));

                // Tell other users someone joined the room
                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    count: memberCount,
                    memberList: room.members
                });

                break;
            }

            // LEAVE ROOM
            case messageType.LEAVE_ROOM : {
                // call leave room function (it will remove the socket from the roomConnections)
                leaveRoom(socket);
                const roomCode = socket.roomCode;
                if(!roomCode){
                    return socket.send(JSON.stringify({
                            type: messageType.ERROR,
                            payload: 'Room not found'
                        }));
                }
                // fetch the latest members list from the DB
                const room = await Room.findOne({roomCode});
                const memberCount = room.members?.length || 0;

                broadCastToRoom(roomCode, {
                    type: messageType.MEMBER_UPDATED,
                    count: memberCount,
                    memberList: room.members
                });

                break;
            }

            // ADD SONG
            case messageType.ADD_SONG : {
                const roomObjectId = data.roomId;
                const currentQueue = await getQueue(roomObjectId); // get the latest queue form the redis
                // add the song in it
                const updatedQueue = await setQueue(roomObjectId, currentQueue.push(data.track)) // set the queue
                
                // broadcast the updated queue to other members
                broadCastToRoom(roomCode, {
                    type: messageType.QUEUE_UPDATE,
                    updatedQueue
                } )
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
            // ignore send errors
        }
    }
}

export {messageHandler}