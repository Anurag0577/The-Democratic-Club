
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
    const roomId = socket.roomId; // save roomId in socket in during join room
    if(roomId || !roomConnections.has(roomId)){
        return;
    }
    roomConnections.get(roomId).delete(socket) // remove the socket
    // now if the size === 0 then delete the room
    if(roomConnections.size === 0){
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
        if(client.readyState === client.OPEN){
            client.send(message)
        }
    });
}


export {joinRoom, leaveRoom, broadCastToRoom}