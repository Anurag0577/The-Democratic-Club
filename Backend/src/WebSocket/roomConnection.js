import WebSocket from 'ws';

const roomConnections = new Map();

// JOIN ROOM 
function joinRoom(roomId, socket){
    // check room exist or not, if not create new
    if(!roomConnections.has(roomId)){
        roomConnections.set(roomId, new Set()) // create an empty room
    }

    roomConnections.get(roomId).add(socket);
    socket.roomId = roomId; 
}



// LEAVE ROOM
function leaveRoom(socket){
    const roomId = socket.roomId; // saved on socket during join
    if(!roomId || !roomConnections.has(roomId)){
        return;
    }
    
    const clients = roomConnections.get(roomId);
    clients.delete(socket); // remove the socket
    
    // if no clients left in this room, delete the room entry
    if(clients.size === 0){
        roomConnections.delete(roomId);
    }
}



// BROADCAST TO EACH CIENt
function broadCastToRoom(roomId, payload){
    // check for the roomId in roomConnections
    if(!roomConnections.has(roomId)){
        return
    }



    // convert this payload into string
    const message =  JSON.stringify(payload)
    const clients = roomConnections.get(roomId);
    console.log('This is all the clients in the room: ', clients)

    clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            try {
                client.send(message);
            } catch(err) {
                console.error('Failed to send message to client:', err);
            }
        }
    });
}


export {joinRoom, leaveRoom, broadCastToRoom}