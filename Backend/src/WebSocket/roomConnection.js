import WebSocket from 'ws';

const roomConnections = new Map();

// JOIN ROOM 
function joinRoom(roomCode, socket){
    // check room exist or not, if not create new
    if(!roomConnections.has(roomCode)){
        roomConnections.set(roomCode, new Set()) // create an empty room
    }

    roomConnections.get(roomCode).add(socket);
    socket.roomCode = roomCode; 
}



// LEAVE ROOM
function leaveRoom(socket){
    const roomCode = socket.roomCode; // saved on socket during join
    if(!roomCode || !roomConnections.has(roomCode)){
        return;
    }
    
    const clients = roomConnections.get(roomCode);
    clients.delete(socket); // remove the socket
    
    // if no clients left in this room, delete the room entry
    if(clients.size === 0){
        roomConnections.delete(roomCode);
    }
}



// BROADCAST TO EACH CLIENT
function broadCastToRoom(roomCode, payload){
    // check for the roomCode in roomConnections
    if(!roomConnections.has(roomCode)){
        return
    }

    // convert this payload into string
    const message =  JSON.stringify(payload)
    const clients = roomConnections.get(roomCode);
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